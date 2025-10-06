import {useEffect, useState, useMemo} from 'react';
import {Input} from '@nextui-org/input';
import {Switch} from '@nextui-org/react';

type SideType = 'ط' | 'ض';

type SymbolItem = {
    insCode: number;
    lVal18AFC: string;
};

type TradeItem = {
    symbolInput: string;
    loading: boolean;
    options: SymbolItem[];
    selected: number | null;
    price: number;         // قیمت خرید یا فروش
    currentPrice: number;  // قیمت فعلی
    count: number;
    strikePrice: number;   // قیمت اعمال
    side: SideType;        // ط یا ض
};

const emptyTradeItem = (): TradeItem => ({
    symbolInput: '',
    loading: false,
    options: [],
    selected: null,
    price: 0,
    currentPrice: 0,
    count: 0,
    strikePrice: 0,
    side: 'ط'
});

const BUY_LIST_KEY = 'buyListCalc';
const SELL_LIST_KEY = 'sellListCalc';

export default function IndexPage() {
    const [buyList, setBuyList] = useState<TradeItem[]>(() => {
        return loadListFromStorage(BUY_LIST_KEY) || [emptyTradeItem()];
    });
    const [sellList, setSellList] = useState<TradeItem[]>(() => {
        return loadListFromStorage(SELL_LIST_KEY) || [emptyTradeItem()];
    });

    const [leveragePrice, setLeveragePrice] = useState<number>(0);

    // ذخیره و Load
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

    // بخش Buy
    const handleBuyInputChange = (idx: number, field: keyof TradeItem, value: any) => {
        setBuyList(list => updateListField(list, idx, field, value));
    };
    const addBuyRow = () => setBuyList(list => [...list, emptyTradeItem()]);
    const removeBuyRow = (idx: number) =>
        setBuyList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    // بخش Sell
    const handleSellInputChange = (idx: number, field: keyof TradeItem, value: any) => {
        setSellList(list => updateListField(list, idx, field, value));
    };
    const addSellRow = () => setSellList(list => [...list, emptyTradeItem()]);
    const removeSellRow = (idx: number) =>
        setSellList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    // فرمول محاسبه currentPrice
    function calculateCurrentPrice(item: TradeItem, leveragePrice: number) {
        let result = 0;
        if (item.side === 'ض') {
            result = leveragePrice - item.strikePrice;
        } else {
            result = item.strikePrice - leveragePrice;
        }
        return result < 1 ? 1 : result;
    }

    // تابع آپدیت یک لیست با محاسبه currentPrice
    function updateListField(list: TradeItem[], idx: number, field: keyof TradeItem, value: any) {
        return list.map((item, i) => {
            if (i !== idx) return item;
            const updatedItem = {...item, [field]: value};

            // اگر فیلد نماد تغییر کرد ⇒ تعیین ط یا ض
            if (field === 'symbolInput' && typeof value === 'string') {
                if (value.trim().startsWith('ض')) updatedItem.side = 'ض';
                else if (value.trim().startsWith('ط')) updatedItem.side = 'ط';
            }

            // اگر strikePrice یا side یا leveragePrice عوض شد ⇒ currentPrice رو حساب کن
            if (field === 'strikePrice' || field === 'side' || field === 'symbolInput') {
                updatedItem.currentPrice = calculateCurrentPrice(updatedItem, leveragePrice);
            }

            return updatedItem;
        });
    }

    // وقتی قیمت اهرم تغییر کند ⇒ همه currentPrice ها بروزرسانی شوند
    useEffect(() => {
        setBuyList(list => list.map(item => ({
            ...item,
            currentPrice: calculateCurrentPrice(item, leveragePrice)
        })));
        setSellList(list => list.map(item => ({
            ...item,
            currentPrice: calculateCurrentPrice(item, leveragePrice)
        })));
    }, [leveragePrice]);

    // محاسبات سود
    const calcBuy = useMemo(() =>
        buyList.reduce((acc, item) => {
            const profit = (item.currentPrice - item.price) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [buyList]);
    const calcSell = useMemo(() =>
        sellList.reduce((acc, item) => {
            const profit = (item.price - item.currentPrice) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [sellList]);
    const totalProfit = calcBuy + calcSell;

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // رندر ردیف خرید/فروش
    const renderTradeRow = (
        list: TradeItem[],
        handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void,
        removeRow: (idx: number) => void,
        type: 'buy' | 'sell'
    ) => list.map((item, idx) => {
        const rowProfit =
            type === 'buy'
                ? ((item.currentPrice ?? 0) - item.price) * item.count * 1000
                : (item.price - (item.currentPrice ?? 0)) * item.count * 1000;

        return (
            <div key={idx}>
                <div className="flex gap-2 md:flex-row flex-col items-center my-2 bg-gray-50 rounded p-2">
                    <Input
                        label={"نماد"}
                        value={item.symbolInput}
                        onValueChange={val => handleInputChange(idx, 'symbolInput', val)}
                    />
                    <Input
                        onValueChange={val => handleInputChange(idx, 'price', Number(val))}
                        type="number"
                        label={type === 'buy' ? "قیمت خرید" : "قیمت فروش"}
                        value={item.price ? String(item.price) : ''}
                    />
                    <Input
                        onValueChange={val => handleInputChange(idx, 'strikePrice', Number(val))}
                        type="number"
                        label="قیمت اعمال"
                        value={item.strikePrice ? String(item.strikePrice) : ''}
                    />
                    <div className="flex flex-col">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={item.side === 'ض'}
                                onChange={() => handleInputChange(idx, 'side', 'ض')}
                            />
                            ض
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={item.side === 'ط'}
                                onChange={() => handleInputChange(idx, 'side', 'ط')}
                            />
                            ط
                        </label>
                    </div>

                    <Input
                        type="number"
                        label="قیمت فعلی"
                        value={item.currentPrice ? String(item.currentPrice) : ''}
                        onValueChange={val => handleInputChange(idx, 'currentPrice', Number(val))}
                    />
                    <Input
                        onValueChange={val => handleInputChange(idx, 'count', Number(val))}
                        type="number"
                        label="تعداد"
                        value={item.count ? String(item.count) : ''}
                    />
                    {(list.length > 1) && (
                        <button onClick={() => removeRow(idx)} className="text-xs text-red-700 px-2 py-1">حذف</button>
                    )}
                </div>

                <div className={`md:text-2xl block mt-1 ${+rowProfit > 0 ? 'text-success' : 'text-danger'}`}>
                    {isNaN(rowProfit) ? 'نامعتبر' : rowProfit.toLocaleString()}
                </div>
            </div>
        )
    });

    return (
        <div>
            {mounted && (
                <>
                    <div className="p-3 mb-4 flex justify-center">
                        <div className={'w-96'}>
                        <Input
                            type="number"
                            label="قیمت"
                            value={leveragePrice ? String(leveragePrice) : ''}
                            onValueChange={val => setLeveragePrice(Number(val))}
                            classNames={{input:'text-center text-3xl font-bold'}}
                            size={'lg'}
                        />
                        </div>
                    </div>

                    <p className={`md:text-5xl text-2xl text-center mt-3 ${+totalProfit > 0 ? 'text-success' : 'text-danger'}`}>
                        {isNaN(totalProfit) ? 'نامعتبر' : totalProfit.toLocaleString()}
                    </p>
                    <div className={"w-full flex md:flex-row flex-col"}>
                        <div className={'border-4 border-success p-4 w-full'}>
                            <p className={"md:text-5xl text-xl text-center"}>خرید</p>
                            {renderTradeRow(buyList, handleBuyInputChange, removeBuyRow, 'buy')}
                            <button className="my-2 bg-green-600 text-white px-3 py-1 rounded" onClick={addBuyRow}>اضافه ردیف</button>
                            <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcBuy > 0 ? 'text-success' : 'text-danger'}`}>
                                {isNaN(calcBuy) ? 'نامعتبر' : calcBuy.toLocaleString()}
                            </p>
                        </div>
                        <div className={'border-4 border-danger p-4 w-full'}>
                            <p className={"md:text-5xl text-xl text-center"}>فروش</p>
                            {renderTradeRow(sellList, handleSellInputChange, removeSellRow, 'sell')}
                            <button className="my-2 bg-red-700 text-white px-3 py-1 rounded" onClick={addSellRow}>اضافه ردیف</button>
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
