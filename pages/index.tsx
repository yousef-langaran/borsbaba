'use client';

import {useEffect, useState, useMemo, useRef} from 'react';
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
    color: string;
};

const emptyTradeItem = (): TradeItem => ({
    symbolInput: '',
    loading: false,
    options: [],
    selected: null,
    nowPrice: {},
    price: 0,
    count: 0,
    description: '',
    color: ''
});

const BUY_LIST_KEY = 'buyList';
const SELL_LIST_KEY = 'sellList';

// رنگ‌هایی که عمداً از طیف‌های مختلف (قرمز، سبز، آبی، زرد، بنفش، قهوه‌ای...) انتخاب شدن تا کاملاً از هم متمایز باشن
const COLOR_PALETTE = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
    '#f58231', '#911eb4', '#42d4f4', '#f032e6',
    '#bfef45', '#fabed4', '#469990', '#9a6324'
];

function darkenColor(hex: string, amount = 0.35): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)));
    const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
    const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

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

    const [showPalette, setShowPalette] = useState(false);
    const paletteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
                setShowPalette(false);
            }
        }
        if (showPalette) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPalette]);

    const style: any = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(item.color ? { '--row-color': item.color, '--row-border-color': darkenColor(item.color) } : {}),
    };

    const inputWrapperClass = item.color
        ? '!bg-[var(--row-color)] !border-2 !border-[var(--row-border-color)]'
        : '';

    const rowProfit =
        type === 'buy'
            ? ((item.nowPrice?.pDrCotVal ?? 0) - item.price) * item.count * 1000
            : (item.price - (item.nowPrice?.pDrCotVal ?? 0)) * item.count * 1000;

    return (
        <div ref={setNodeRef} style={style}>
            <div
                className={`flex gap-2 md:flex-row flex-col items-center my-2 rounded p-2 ${item.color ? '' : 'bg-gray-50'}`}
                style={{ cursor: 'grab', backgroundColor: item.color || undefined }}
            >
                {/* 🔹 آیکون درگ */}
                <span {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 flex items-center">
          <Icon icon="mdi:drag-variant" width="22" height="22" />
        </span>

                {/* 🎨 انتخاب رنگ */}
                <div ref={paletteRef} className="relative flex items-center">
                    <button
                        type="button"
                        onClick={() => setShowPalette(v => !v)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center shrink-0"
                        style={{ backgroundColor: item.color || '#ffffff' }}
                        title="انتخاب رنگ"
                    >
                        {!item.color && <Icon icon="mdi:palette-outline" width="16" height="16" className="text-gray-500" />}
                    </button>
                    {showPalette && (
                        <div className="absolute z-20 top-9 right-0 w-44 grid grid-cols-4 gap-2 justify-items-center bg-white p-2 rounded shadow-lg border border-gray-200">
                            {COLOR_PALETTE.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { handleInputChange(idx, 'color', c); setShowPalette(false); }}
                                    className="w-7 h-7 shrink-0 rounded-full border border-gray-300"
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => { handleInputChange(idx, 'color', ''); setShowPalette(false); }}
                                className="col-span-4 mt-1 text-xs text-gray-500 hover:text-gray-700"
                            >
                                حذف رنگ
                            </button>
                        </div>
                    )}
                </div>

                <Autocomplete
                    label={"نماد"}
                    onInputChange={val => handleInputChange(idx, 'symbolInput', val)}
                    isLoading={item.loading}
                    onSelectionChange={val => handleInputChange(idx, 'selected', val)}
                    selectedKey={item.selected?.toString()}
                    inputProps={{ classNames: { inputWrapper: inputWrapperClass } }}
                >
                    {item.options.map(opt => (
                        <AutocompleteItem key={opt.insCode}>{opt.lVal18AFC}</AutocompleteItem>
                    ))}
                </Autocomplete>

                <Input
                    classNames={{inputWrapper: `h-14 ${inputWrapperClass}`}}
                    onValueChange={val => handleInputChange(idx, 'description', val)}
                    value={item.description ? String(item.description) : ''}
                />
                <Input
                    classNames={{inputWrapper: inputWrapperClass}}
                    onValueChange={val => handleInputChange(idx, 'price', Number(val))}
                    type={"number"}
                    label={"قیمت"}
                    value={item.price ? String(item.price) : ''}
                />
                <Input
                    classNames={{inputWrapper: inputWrapperClass}}
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
