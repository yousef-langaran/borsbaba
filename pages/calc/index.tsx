import {useEffect, useState, useMemo} from 'react';
import {Autocomplete, AutocompleteItem} from '@nextui-org/react';
import {Input} from '@nextui-org/input';

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
    currentPrice: number;  // قیمت فعلی که کاربر وارد می‌کند
    count: number;
};

const emptyTradeItem = (): TradeItem => ({
    symbolInput: '',
    loading: false,
    options: [],
    selected: null,
    price: 0,
    currentPrice: 0,
    count: 0,
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

    // تغییرات خرید
    const handleBuyInputChange = (idx: number, field: keyof TradeItem, value: any) => {
        setBuyList(list =>
            list.map((item, i) => (i === idx ? {...item, [field]: value} : item))
        );
    };
    const addBuyRow = () => setBuyList(list => [...list, emptyTradeItem()]);
    const removeBuyRow = (idx: number) =>
        setBuyList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    // تغییرات فروش
    const handleSellInputChange = (idx: number, field: keyof TradeItem, value: any) => {
        setSellList(list =>
            list.map((item, i) => (i === idx ? {...item, [field]: value} : item))
        );
    };
    const addSellRow = () => setSellList(list => [...list, emptyTradeItem()]);
    const removeSellRow = (idx: number) =>
        setSellList(list => list.length > 1 ? list.filter((_, i) => i !== idx) : list);

    // محاسبه سود خرید
    const calcBuy = useMemo(() =>
        buyList.reduce((acc, item) => {
            const profit = (item.currentPrice - item.price) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [buyList]);

    // محاسبه سود فروش
    const calcSell = useMemo(() =>
        sellList.reduce((acc, item) => {
            const profit = (item.price - item.currentPrice) * item.count * 1000;
            return acc + (isNaN(profit) ? 0 : profit);
        }, 0), [sellList]);

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
                        onValueChange={val => handleInputChange(idx, 'price', Number(val))}
                        type="number"
                        label={type === 'buy' ? "قیمت خرید" : "قیمت فروش"}
                        value={item.price ? String(item.price) : ''}
                    />
                    <Input
                        onValueChange={val => handleInputChange(idx, 'currentPrice', Number(val))}
                        type="number"
                        label="قیمت فعلی"
                        value={item.currentPrice ? String(item.currentPrice) : ''}
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

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <div>
            {mounted && (
                <>
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