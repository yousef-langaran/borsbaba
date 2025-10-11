'use client';

import {useEffect, useState, useMemo} from 'react';
import axios from 'axios';
import {Autocomplete, AutocompleteItem} from '@nextui-org/react';
import {Input} from '@nextui-org/input';
import {DndContext, useSensor, useSensors, PointerSensor, closestCenter} from '@dnd-kit/core';
import {SortableContext, useSortable, arrayMove, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Icon} from "@iconify/react";

type SymbolItem = {
    insCode: number;
    lVal18AFC: string;
};

type TradeItem = {
    symbolInput: string;
    loading: boolean;
    options: SymbolItem[];
    selected: number | null;
    nowPrice: any;
    price: number;
    count: number;
    description: string;
};

const emptyTradeItem = (): TradeItem => ({
    symbolInput: '',
    loading: false,
    options: [],
    selected: null,
    nowPrice: {},
    price: 0,
    count: 0,
    description: ''
});

const BUY_LIST_KEY = 'buyList';
const SELL_LIST_KEY = 'sellList';

// ✅ جزء قابل مرتب‌سازی (ردیف منفرد)
function SortableTradeRow({
                              id,
                              item,
                              idx,
                              type,
                              handleInputChange,
                              removeRow
                          }: {
    id: string;
    item: TradeItem;
    idx: number;
    type: 'buy' | 'sell';
    handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
    removeRow: (idx: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const rowProfit =
        type === 'buy'
            ? ((item.nowPrice?.pDrCotVal ?? 0) - item.price) * item.count * 1000
            : (item.price - (item.nowPrice?.pDrCotVal ?? 0)) * item.count * 1000;

    return (
        <div ref={setNodeRef} style={style}>
            <div
                className="flex gap-2 md:flex-row flex-col items-center my-2 bg-gray-50 rounded p-2"
                style={{ cursor: 'grab' }}
            >
                {/* 🔹 آیکون درگ */}
                <span {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 flex items-center">
          <Icon icon="mdi:drag-variant" width="22" height="22" />
        </span>

                <Autocomplete
                    label={"نماد"}
                    onInputChange={val => handleInputChange(idx, 'symbolInput', val)}
                    isLoading={item.loading}
                    onSelectionChange={val => handleInputChange(idx, 'selected', val)}
                    selectedKey={item.selected?.toString()}
                >
                    {item.options.map(opt => (
                        <AutocompleteItem key={opt.insCode}>{opt.lVal18AFC}</AutocompleteItem>
                    ))}
                </Autocomplete>

                <Input
                    classNames={{inputWrapper: 'h-14'}}
                    onValueChange={val => handleInputChange(idx, 'description', val)}
                    value={item.description ? String(item.description) : ''}
                />
                <Input
                    onValueChange={val => handleInputChange(idx, 'price', Number(val))}
                    type={"number"}
                    label={"قیمت"}
                    value={item.price ? String(item.price) : ''}
                />
                <Input
                    onValueChange={val => handleInputChange(idx, 'count', Number(val))}
                    type={"number"}
                    label={"تعداد"}
                    value={item.count ? String(item.count) : ''}
                />
                <span className={`text-lg ${type === 'buy' ? 'text-success' : 'text-danger'}`}>
          {(item.nowPrice?.pDrCotVal || 0).toLocaleString()}
        </span>
                {(listLengthCheck(type) > 1) && (
                    <button onClick={() => removeRow(idx)} className="text-xs text-red-700 px-2 py-1">
                        حذف
                    </button>
                )}
            </div>
            <div className={`md:text-2xl block mt-1 ${+rowProfit > 0 ? 'text-success' : 'text-danger'}`}>
                {isNaN(rowProfit) ? 'نامعتبر' : rowProfit.toLocaleString()}
            </div>
        </div>
    );

    function listLengthCheck(t: 'buy' | 'sell') {
        return t === 'buy' ? document.querySelectorAll('.border-success .flex.my-2').length : document.querySelectorAll('.border-danger .flex.my-2').length;
    }
}

export default function IndexPage() {
    const [buyList, setBuyList] = useState<TradeItem[]>(() => loadListFromStorage(BUY_LIST_KEY) || [emptyTradeItem()]);
    const [sellList, setSellList] = useState<TradeItem[]>(() => loadListFromStorage(SELL_LIST_KEY) || [emptyTradeItem()]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const sensors = useSensors(useSensor(PointerSensor));

    const fetchAllSymboles = async (symbol: string = '') => {
        try {
            const res = await axios.get(`/api/tsetmc?symbol=${encodeURIComponent(symbol)}`);
            return res.data?.instrumentSearch || [];
        } catch {
            return [];
        }
    };

    const fetchDetailsSymboles = async (symbol: number) => {
        try {
            const res = await axios.get(`/api/tsetmcDetails?symbol=${encodeURIComponent(symbol)}`);
            return res.data?.closingPriceInfo || {};
        } catch {
            return {};
        }
    };

    // --- useEffect‌ها (همون قبلی تو) ---
    useEffect(() => {
        buyList.forEach((item, idx) => {
            if (item.symbolInput) {
                handleBuyInputChange(idx, 'loading', true);
                fetchAllSymboles(item.symbolInput).then(data => {
                    handleBuyInputChange(idx, 'options', data);
                    handleBuyInputChange(idx, 'loading', false);
                });
            } else handleBuyInputChange(idx, 'options', []);
        });
    }, [buyList.map(i => i.symbolInput).join(',')]);

    useEffect(() => {
        let abort = false;
        let timers: NodeJS.Timeout[] = [];
        buyList.forEach((item, idx) => {
            if (item.selected) {
                const poll = async () => {
                    if (abort) return;
                    const price = await fetchDetailsSymboles(item.selected as number);
                    if (price && Object.keys(price).length > 0 && price.pDrCotVal != null)
                        handleBuyInputChange(idx, 'nowPrice', price);
                    if (!abort) {
                        const t = setTimeout(poll, 2000);
                        timers.push(t);
                    }
                };
                poll();
            }
        });
        return () => {
            abort = true;
            timers.forEach(clearTimeout);
        };
    }, [buyList.map(i => i.selected).join(',')]);

    useEffect(() => {
        sellList.forEach((item, idx) => {
            if (item.symbolInput) {
                handleSellInputChange(idx, 'loading', true);
                fetchAllSymboles(item.symbolInput).then(data => {
                    handleSellInputChange(idx, 'options', data);
                    handleSellInputChange(idx, 'loading', false);
                });
            } else handleSellInputChange(idx, 'options', []);
        });
    }, [sellList.map(i => i.symbolInput).join(',')]);

    useEffect(() => {
        let timers: NodeJS.Timeout[] = [];
        sellList.forEach((item, idx) => {
            if (item.selected) {
                const update = async () => {
                    const price = await fetchDetailsSymboles(item.selected as number);
                    if (price && Object.keys(price).length > 0 && price.pDrCotVal != null)
                        handleSellInputChange(idx, 'nowPrice', price);
                };
                update();
                const t = setInterval(update, 2000);
                timers.push(t);
            }
        });
        return () => timers.forEach(clearInterval);
    }, [sellList.map(i => i.selected).join(',')]);

    function handleBuyInputChange(idx: number, field: keyof TradeItem, value: any) {
        setBuyList(list => list.map((item, i) => (i === idx ? {...item, [field]: value} : item)));
    }
    function handleSellInputChange(idx: number, field: keyof TradeItem, value: any) {
        setSellList(list => list.map((item, i) => (i === idx ? {...item, [field]: value} : item)));
    }
    const addBuyRow = () => setBuyList(list => [...list, emptyTradeItem()]);
    const addSellRow = () => setSellList(list => [...list, emptyTradeItem()]);
    const removeBuyRow = (idx: number) => setBuyList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);
    const removeSellRow = (idx: number) => setSellList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    const calcBuy = useMemo(() =>
        buyList.reduce((acc, item) => {
            const currentPrice = item.nowPrice?.pDrCotVal ?? 0;
            const profit = (currentPrice - item.price) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [buyList]);

    const calcSell = useMemo(() =>
        sellList.reduce((acc, item) => {
            const currentPrice = item.nowPrice?.pDrCotVal ?? 0;
            const profit = (item.price - currentPrice) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [sellList]);

    const totalProfit = calcBuy + calcSell;

    useEffect(() => saveListToStorage(BUY_LIST_KEY, buyList), [buyList]);
    useEffect(() => saveListToStorage(SELL_LIST_KEY, sellList), [sellList]);

    function loadListFromStorage(key: string) {
        try {
            const str = localStorage.getItem(key);
            return str ? JSON.parse(str) : undefined;
        } catch {
            return undefined;
        }
    }

    function saveListToStorage(key: string, list: TradeItem[]) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    const totalBuyValue = useMemo(() =>
            buyList.reduce((acc, item) => acc + ((item.nowPrice?.pDrCotVal ?? 0) * item.count * 1000), 0),
        [buyList]
    );
    const totalSellValue = useMemo(() =>
            sellList.reduce((acc, item) => acc + ((item.nowPrice?.pDrCotVal ?? 0) * item.count * 1000), 0),
        [sellList]
    );

    function handleDragEndBuy(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = parseInt(active.id.replace('buy-', ''));
            const newIndex = parseInt(over.id.replace('buy-', ''));
            setBuyList(list => arrayMove(list, oldIndex, newIndex));
        }
    }

    function handleDragEndSell(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = parseInt(active.id.replace('sell-', ''));
            const newIndex = parseInt(over.id.replace('sell-', ''));
            setSellList(list => arrayMove(list, oldIndex, newIndex));
        }
    }

    return (
        <div>
            {mounted && (
                <>
                    <p className={`md:text-5xl text-2xl text-center mt-3 ${+totalProfit > 0 ? 'text-success' : 'text-danger'}`}>
                        {isNaN(totalProfit) ? 'نامعتبر' : totalProfit.toLocaleString()}
                    </p>
                    <div className="w-full flex md:flex-row flex-col">
                        {/* ---- خرید ---- */}
                        <div className="border-4 border-success p-4 w-full">
                            <p className="md:text-5xl text-xl text-center">خرید</p>
                            <p className="text-sm text-gray-500 text-center">
                                {totalBuyValue.toLocaleString()}
                            </p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndBuy}>
                                <SortableContext items={buyList.map((_, i) => `buy-${i}`)} strategy={verticalListSortingStrategy}>
                                    {buyList.map((item, idx) => (
                                        <SortableTradeRow
                                            key={`buy-${idx}`}
                                            id={`buy-${idx}`}
                                            item={item}
                                            idx={idx}
                                            type="buy"
                                            handleInputChange={handleBuyInputChange}
                                            removeRow={removeBuyRow}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <button onClick={addBuyRow} className="my-2 bg-green-600 text-white px-3 py-1 rounded">
                                اضافه ردیف
                            </button>
                            <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcBuy > 0 ? 'text-success' : 'text-danger'}`}>
                                {isNaN(calcBuy) ? 'نامعتبر' : calcBuy.toLocaleString()}
                            </p>
                        </div>

                        {/* ---- فروش ---- */}
                        <div className="border-4 border-danger p-4 w-full">
                            <p className="md:text-5xl text-xl text-center">فروش</p>
                            <p className="text-sm text-gray-500 text-center">
                                {totalSellValue.toLocaleString()}
                            </p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSell}>
                                <SortableContext items={sellList.map((_, i) => `sell-${i}`)} strategy={verticalListSortingStrategy}>
                                    {sellList.map((item, idx) => (
                                        <SortableTradeRow
                                            key={`sell-${idx}`}
                                            id={`sell-${idx}`}
                                            item={item}
                                            idx={idx}
                                            type="sell"
                                            handleInputChange={handleSellInputChange}
                                            removeRow={removeSellRow}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <button onClick={addSellRow} className="my-2 bg-red-700 text-white px-3 py-1 rounded">
                                اضافه ردیف
                            </button>
                            <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcSell > 0 ? 'text-success' : 'text-danger'}`}>
                                {isNaN(calcSell) ? 'نامعتبر' : calcSell.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
