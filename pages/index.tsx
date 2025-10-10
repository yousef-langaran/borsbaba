import {useEffect, useState, useMemo} from 'react';
import axios from 'axios';
import {Autocomplete, AutocompleteItem} from '@nextui-org/react';
import {Input} from '@nextui-org/input';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {SortableTradeList} from "@/components/baba/SortableTradeList";
type SymbolItem = {
    insCode: number;
    lVal18AFC: string;
};

export type TradeItem = {
    symbolInput: string;
    loading: boolean;
    options: SymbolItem[];
    selected: number | null;
    nowPrice: any; // می‌تونی تایپ دقیق بزنی
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

// در همون فایل بذار بالا یا جدا:
const BUY_LIST_KEY = 'buyList';
const SELL_LIST_KEY = 'sellList';
export default function IndexPage() {
    // لیست خرید و فروش
    const [buyList, setBuyList] = useState<TradeItem[]>(() => {
        return loadListFromStorage(BUY_LIST_KEY) || [emptyTradeItem()];
    });
    const [sellList, setSellList] = useState<TradeItem[]>(() => {
        return loadListFromStorage(SELL_LIST_KEY) || [emptyTradeItem()];
    });

    // توابع بخش خرید
    const handleBuyInputChange = (idx: number, field: keyof TradeItem, value: any) => {
        setBuyList(list =>
            list.map((item, i) => (i === idx ? {...item, [field]: value} : item))
        );
    };

    const addBuyRow = () => setBuyList(list => [...list, emptyTradeItem()]);
    const removeBuyRow = (idx: number) =>
        setBuyList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    // توابع بخش فروش
    const handleSellInputChange = (idx: number, field: keyof TradeItem, value: any) => {
        setSellList(list =>
            list.map((item, i) => (i === idx ? {...item, [field]: value} : item))
        );
    };

    const addSellRow = () => setSellList(list => [...list, emptyTradeItem()]);
    const removeSellRow = (idx: number) =>
        setSellList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    // گرفتن لیست نمادها
    const fetchAllSymboles = async (symbol: string = '') => {
        try {
            const res = await axios.get(`/api/tsetmc?symbol=${encodeURIComponent(symbol)}`);
            return res.data?.instrumentSearch || [];
        } catch (e) {
            return [];
        }
    };

    // گرفتن جزییات قیمت هر نماد
    const fetchDetailsSymboles = async (symbol: number) => {
        try {
            const res = await axios.get(`/api/tsetmcDetails?symbol=${encodeURIComponent(symbol)}`);
            return res.data?.closingPriceInfo || {};
        } catch (e) {
            return {};
        }
    };

    // useEffect برای جستجوی نمادها (خرید)
    useEffect(() => {
        buyList.forEach((item, idx) => {
            if (item.symbolInput) {
                handleBuyInputChange(idx, 'loading', true);
                fetchAllSymboles(item.symbolInput).then(data => {
                    handleBuyInputChange(idx, 'options', data);
                    handleBuyInputChange(idx, 'loading', false);
                });
            } else {
                handleBuyInputChange(idx, 'options', []);
            }
        });
        // فقط روی تغییر symbolInput اقدام می‌کنیم
        // eslint-disable-next-line
    }, [buyList.map(i => i.symbolInput).join(',')]);

    // useEffect لیوآپدیت قیمت‌ها (خرید)
    useEffect(() => {
        let abort = false;
        let timers: NodeJS.Timeout[] = [];

        buyList.forEach((item, idx) => {
            if (item.selected) {
                const poll = async () => {
                    if (abort) return;
                    try {
                        const price = await fetchDetailsSymboles(item.selected as number);
                        if (price && Object.keys(price).length > 0 && price.pDrCotVal != null) {
                            handleBuyInputChange(idx, 'nowPrice', price);
                        }
                    } catch (e) {
                        // خطا رو نادیده می‌گیریم
                    }
                    if (!abort) {
                        // فقط بعد از اتمام درخواست،‌ تایمر برای درخواست بعدی ست می‌کنیم
                        const t = setTimeout(poll, 2000);
                        timers.push(t);
                    }
                };
                poll(); // اولین اجرا
            }
        });

        return () => {
            abort = true;
            timers.forEach(clearTimeout);
        };
        // eslint-disable-next-line
    }, [buyList.map(i => i.selected).join(',')]);

    // useEffect جستجوی نمادها (فروش)
    useEffect(() => {
        sellList.forEach((item, idx) => {
            if (item.symbolInput) {
                handleSellInputChange(idx, 'loading', true);
                fetchAllSymboles(item.symbolInput).then(data => {
                    handleSellInputChange(idx, 'options', data);
                    handleSellInputChange(idx, 'loading', false);
                });
            } else {
                handleSellInputChange(idx, 'options', []);
            }
        });
        // eslint-disable-next-line
    }, [sellList.map(i => i.symbolInput).join(',')]);

    // useEffect لیوآپدیت قیمت‌ها (فروش)
    useEffect(() => {
        let timers: NodeJS.Timeout[] = [];
        sellList.forEach((item, idx) => {
            if (item.selected) {
                const update = async () => {
                    const price = await fetchDetailsSymboles(item.selected as number);
                    if (price && Object.keys(price).length > 0 && price.pDrCotVal != null) {
                        handleSellInputChange(idx, 'nowPrice', price);
                    }
                };
                update();
                const t = setInterval(update, 2000);
                timers.push(t);
            }
        });
        return () => timers.forEach(clearInterval);
        // eslint-disable-next-line
    }, [sellList.map(i => i.selected).join(',')]);

    // سود خرید
    const calcBuy = useMemo(() =>
        buyList.reduce((acc, item) => {
            const currentPrice = item.nowPrice?.pDrCotVal ?? 0;
            const profit = (currentPrice - item.price) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [buyList]);

    // سود فروش
    const calcSell = useMemo(() =>
        sellList.reduce((acc, item) => {
            const currentPrice = item.nowPrice?.pDrCotVal ?? 0;
            const profit = (item.price - currentPrice) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [sellList]);

    // سود کل
    const totalProfit = calcBuy + calcSell;

    function loadListFromStorage(key: string) {
        try {
            const str = localStorage.getItem(key);
            return str ? JSON.parse(str) : undefined;
        } catch (e) {
            return undefined;
        }
    }

    function saveListToStorage(key: string, list: TradeItem[]) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    useEffect(() => {
        saveListToStorage(BUY_LIST_KEY, buyList);
    }, [buyList]);

    useEffect(() => {
        saveListToStorage(SELL_LIST_KEY, sellList);
    }, [sellList]);


    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const totalBuyValue = useMemo(() =>
        buyList.reduce((acc, item) => {
            const currentPrice = item.nowPrice?.pDrCotVal ?? 0;
            return acc + (currentPrice * item.count * 1000);
        }, 0), [buyList]);

// مجموع ارزش فعلی فروش
    const totalSellValue = useMemo(() =>
        sellList.reduce((acc, item) => {
            const currentPrice = item.nowPrice?.pDrCotVal ?? 0;
            return acc + (currentPrice * item.count * 1000);
        }, 0), [sellList]);


    return (
        <div>
            {mounted ? (
                <>
                    <p className={`md:text-5xl text-2xl text-center mt-3 ${mounted && +totalProfit > 0 ? 'text-success' : 'text-danger'}`}>
                        {mounted
                            ? (isNaN(totalProfit) ? 'نامعتبر' : totalProfit.toLocaleString())
                            : ''}
                    </p>
                    <div className={"w-full flex md:flex-row flex-col"}>
                        <div className={'border-4 border-success p-4 w-full'}>
                            <p className={"md:text-5xl text-xl text-center"}>خرید</p>
                            <p className="text-sm text-gray-500 text-center">
                                {mounted ? totalBuyValue.toLocaleString() : ''}
                            </p>
                            <SortableTradeList
                                list={buyList}
                                setList={setBuyList}
                                handleInputChange={handleBuyInputChange}
                                removeRow={removeBuyRow}
                                type="buy"
                                mounted={mounted}
                            />                            <button className="my-2 bg-green-600 text-white px-3 py-1 rounded" onClick={addBuyRow}>اضافه ردیف
                            </button>
                            <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcBuy > 0 ? 'text-success' : 'text-danger'}`}>
                                {mounted
                                    ? (isNaN(calcBuy) ? 'نامعتبر' : calcBuy.toLocaleString())
                                    : ''}
                            </p>
                        </div>
                        <div className={'border-4 border-danger p-4 w-full'}>
                            <p className={"md:text-5xl text-xl text-center"}>فروش</p>
                            <p className="text-sm text-gray-500 text-center">
                                {mounted ? totalSellValue.toLocaleString() : ''}
                            </p>
                            <SortableTradeList
                                list={sellList}
                                setList={setSellList}
                                handleInputChange={handleSellInputChange}
                                removeRow={removeSellRow}
                                type="sell"
                                mounted={mounted}
                            />                            <button className="my-2 bg-red-700 text-white px-3 py-1 rounded" onClick={addSellRow}>اضافه ردیف
                            </button>
                            <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcSell > 0 ? 'text-success' : 'text-danger'}`}>
                                {mounted ? isNaN(calcSell) ? 'نامعتبر' : calcSell.toLocaleString() : ''}
                            </p>
                        </div>
                    </div>
                </>) : (null)}
        </div>
    );
}
