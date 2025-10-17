import {useState, useEffect, useMemo} from 'react';
import {Input} from '@nextui-org/input';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Icon} from '@iconify/react';

type SideType = 'ط' | 'ض' | 'خودش';
type SymbolItem = { insCode: number; lVal18AFC: string };
type TradeItem = {
    symbolInput: string;
    loading: boolean;
    options: SymbolItem[];
    selected: number | null;
    price: number;
    currentPrice: number;
    count: number;
    strikePrice: number;
    side: SideType;
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
    side: 'خودش'
});

const BUY_LIST_KEY = 'buyListCalc';
const SELL_LIST_KEY = 'sellListCalc';

const formatNumber = (val: number | string) => {
    if (val === '' || val == null || isNaN(Number(val))) return '';
    return Number(val).toLocaleString('fa-IR'); // جداکننده سه‌رقمی فارسی
};

// 🏷️ ردیف درگ‌پذیر فقط با آیکون
function SortableTradeRow({
                              id,
                              item,
                              idx,
                              handleInputChange,
                              removeRow,
                              type,
                              list
                          }: {
    id: string;
    item: TradeItem;
    idx: number;
    handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
    removeRow: (idx: number) => void;
    type: 'buy' | 'sell';
    list: TradeItem[];
}) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
        useSortable({id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1
    };
    const rowProfit =
        type === 'buy'
            ? ((item.currentPrice ?? 0) - item.price) * item.count * 1000
            : (item.price - (item.currentPrice ?? 0)) * item.count * 1000;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div className="flex gap-2 md:flex-row flex-col items-center my-2 bg-gray-50 rounded p-2">
                <div {...listeners} className="cursor-grab hover:text-blue-600 select-none" title="Drag">
                    <Icon icon="mdi:drag-variant" width="22" height="22" />
                </div>

                <Input
                    label="نماد"
                    value={item.symbolInput}
                    onValueChange={val => handleInputChange(idx, 'symbolInput', val)}
                />

                <Input
                    type="text"
                    step={1000}
                    label={type === 'buy' ? 'قیمت خرید' : 'قیمت فروش'}
                    value={item.price ? formatNumber(item.price) : ''}
                    onValueChange={val => {
                        const num = Number(String(val).replace(/,/g, ''));
                        handleInputChange(idx, 'price', num);
                    }}
                />

                <Input
                    type="text"
                    step={1000}
                    label="قیمت اعمال"
                    value={item.strikePrice ? formatNumber(item.strikePrice) : ''}
                    onValueChange={val => {
                        const num = Number(String(val).replace(/,/g, ''));
                        handleInputChange(idx, 'strikePrice', num);
                    }}
                />

                <div className="flex flex-col">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.side === 'ض'}
                            onChange={() => handleInputChange(idx, 'side', 'ض')}
                        /> ض
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.side === 'ط'}
                            onChange={() => handleInputChange(idx, 'side', 'ط')}
                        /> ط
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.side === 'خودش'}
                            onChange={() => handleInputChange(idx, 'side', 'خودش')}
                        /> خودش
                    </label>
                </div>

                <Input
                    type="text"
                    step={1000}
                    label="قیمت فعلی"
                    value={item.currentPrice ? formatNumber(item.currentPrice) : ''}
                    onValueChange={val => {
                        const num = Number(String(val).replace(/,/g, ''));
                        handleInputChange(idx, 'currentPrice', num);
                    }}
                />

                <Input
                    type="text"
                    step={1000}
                    label="تعداد"
                    value={item.count ? formatNumber(item.count) : ''}
                    onValueChange={val => {
                        const num = Number(String(val).replace(/,/g, ''));
                        handleInputChange(idx, 'count', num);
                    }}
                />

                {list.length > 1 && (
                    <button
                        onClick={() => removeRow(idx)}
                        className="text-xs text-red-700 px-2 py-1"
                    >
                        حذف
                    </button>
                )}
            </div>

            <div
                className={`md:text-2xl block mt-1 ${
                    +rowProfit > 0 ? 'text-success' : 'text-danger'
                }`}
            >
                {isNaN(rowProfit) ? 'نامعتبر' : formatNumber(rowProfit)}
            </div>
        </div>
    );
}

function SortableTradeList({
                               list,
                               setList,
                               handleInputChange,
                               removeRow,
                               type
                           }: {
    list: TradeItem[];
    setList: React.Dispatch<React.SetStateAction<TradeItem[]>>;
    handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
    removeRow: (idx: number) => void;
    type: 'buy' | 'sell';
}) {
    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event: any) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;
        const oldIndex = list.findIndex((_, i) => i.toString() === active.id);
        const newIndex = list.findIndex((_, i) => i.toString() === over.id);
        setList(arrayMove(list, oldIndex, newIndex));
    };
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={list.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                {list.map((item, idx) => (
                    <SortableTradeRow
                        key={idx}
                        id={idx.toString()}
                        item={item}
                        idx={idx}
                        handleInputChange={handleInputChange}
                        removeRow={removeRow}
                        type={type}
                        list={list}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default function IndexPage() {
    const [buyList, setBuyList] = useState<TradeItem[]>(() => {
        try {
            const str = localStorage.getItem('buyListCalc');
            return str ? JSON.parse(str) : [emptyTradeItem()];
        } catch { return [emptyTradeItem()]; }
    });
    const [sellList, setSellList] = useState<TradeItem[]>(() => {
        try {
            const str = localStorage.getItem('sellListCalc');
            return str ? JSON.parse(str) : [emptyTradeItem()];
        } catch { return [emptyTradeItem()]; }
    });
    const [leveragePrice, setLeveragePrice] = useState(0);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    useEffect(() => localStorage.setItem('buyListCalc', JSON.stringify(buyList)), [buyList]);
    useEffect(() => localStorage.setItem('sellListCalc', JSON.stringify(sellList)), [sellList]);

    const calcCurrentPrice = (item: TradeItem, lp: number) =>
        Math.max(1, item.side === 'ض' ? lp - item.strikePrice :
            item.side === 'ط' ? item.strikePrice - lp : lp);

    const updateField = (list: TradeItem[], idx: number, field: keyof TradeItem, value: any) =>
        list.map((item, i) => {
            if (i !== idx) return item;
            const updated = {...item, [field]: value};
            if (field === 'symbolInput' && typeof value === 'string') {
                if (value.trim().startsWith('ض')) updated.side = 'ض';
                else if (value.trim().startsWith('ط')) updated.side = 'ط';
            }
            if (['strikePrice', 'side', 'symbolInput'].includes(field))
                updated.currentPrice = calcCurrentPrice(updated, leveragePrice);
            return updated;
        });

    const handleBuyChange = (i: number, f: keyof TradeItem, v: any) => setBuyList(l => updateField(l, i, f, v));
    const handleSellChange = (i: number, f: keyof TradeItem, v: any) => setSellList(l => updateField(l, i, f, v));
    const addBuy = () => setBuyList(l => [...l, emptyTradeItem()]);
    const addSell = () => setSellList(l => [...l, emptyTradeItem()]);
    const removeBuy = (i: number) => setBuyList(l => l.length > 1 ? l.filter((_, x) => x !== i) : l);
    const removeSell = (i: number) => setSellList(l => l.length > 1 ? l.filter((_, x) => x !== i) : l);

    useEffect(() => {
        setBuyList(l => l.map(it => ({...it, currentPrice: calcCurrentPrice(it, leveragePrice)})));
        setSellList(l => l.map(it => ({...it, currentPrice: calcCurrentPrice(it, leveragePrice)})));
    }, [leveragePrice]);

    const calcBuy = useMemo(() => buyList.reduce((a, it) => a + ((it.currentPrice - it.price) * it.count * 1000 || 0), 0), [buyList]);
    const calcSell = useMemo(() => sellList.reduce((a, it) => a + ((it.price - it.currentPrice) * it.count * 1000 || 0), 0), [sellList]);
    const totalProfit = calcBuy + calcSell;

    return mounted ? (
        <div>
            <div className="p-3 mb-4 flex justify-center">
                <div className="w-96">
                    <Input
                        type="text"
                        step={1000}
                        label="قیمت"
                        value={leveragePrice ? formatNumber(leveragePrice) : ''}
                        onValueChange={val => {
                            const num = Number(String(val).replace(/,/g, ''));
                            setLeveragePrice(num);
                        }}
                        classNames={{input:'text-center text-3xl font-bold'}}
                        size="lg"
                    />
                </div>
            </div>

            <p className={`md:text-5xl text-2xl text-center mt-3 ${+totalProfit > 0 ? 'text-success' : 'text-danger'}`}>
                {isNaN(totalProfit) ? 'نامعتبر' : formatNumber(totalProfit)}
            </p>

            <div className="w-full flex md:flex-row flex-col">
                <div className="border-4 border-success p-4 w-full">
                    <p className="md:text-5xl text-xl text-center">خرید</p>
                    <SortableTradeList list={buyList} setList={setBuyList} handleInputChange={handleBuyChange} removeRow={removeBuy} type="buy" />
                    <button className="my-2 bg-green-600 text-white px-3 py-1 rounded" onClick={addBuy}>اضافه ردیف</button>
                    <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcBuy > 0 ? 'text-success' : 'text-danger'}`}>
                        {isNaN(calcBuy) ? 'نامعتبر' : formatNumber(calcBuy)}
                    </p>
                </div>

                <div className="border-4 border-danger p-4 w-full">
                    <p className="md:text-5xl text-xl text-center">فروش</p>
                    <SortableTradeList list={sellList} setList={setSellList} handleInputChange={handleSellChange} removeRow={removeSell} type="sell" />
                    <button className="my-2 bg-red-700 text-white px-3 py-1 rounded" onClick={addSell}>اضافه ردیف</button>
                    <p className={`md:text-5xl text-2xl text-center mt-3 ${+calcSell > 0 ? 'text-success' : 'text-danger'}`}>
                        {isNaN(calcSell) ? 'نامعتبر' : formatNumber(calcSell)}
                    </p>
                </div>
            </div>
        </div>
    ) : null;
}
