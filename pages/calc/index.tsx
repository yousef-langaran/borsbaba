import { useState, useEffect, useMemo } from "react";
import { Input } from "@nextui-org/input";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";

type SideType = "ط" | "ض" | "خودش";
type SymbolItem = { insCode: number; lVal18AFC: string };

type TradeItem = {
    symbolInput: string;
    loading: boolean;
    options: SymbolItem[];
    selected: number | null;
    price: number;
    strikePrice: number;
    currentPrice: number;
    count: number;
    side: SideType;
};

const emptyTradeItem = (): TradeItem => ({
    symbolInput: "",
    loading: false,
    options: [],
    selected: null,
    price: 0,
    strikePrice: 0,
    currentPrice: 0,
    count: 0,
    side: "خودش",
});

const BUY_LIST_KEY = "buyListCalc";
const SELL_LIST_KEY = "sellListCalc";
const LEVERAGE_PRICE_KEY = "leveragePriceCalc";

const formatNumber = (num: number | string): string => {
    if (num === "" || num == null) return "";
    const n = Number(String(num).replace(/,/g, ""));
    if (isNaN(n) || n === 0) return "";
    return n.toLocaleString("fa-IR");
};

const parseNumber = (val: string): number =>
    Number(String(val).replace(/,/g, "").trim() || "0");

const detectSideFromSymbol = (symbol: string): SideType => {
    const firstChar = symbol.trim()[0];
    if (firstChar === "ط") return "ط";
    if (firstChar === "ض") return "ض";
    return "خودش";
};

// ---------------- NumberInput Component با دکمه‌های افزایش/کاهش ----------------
function NumberInput({
                         value,
                         onChange,
                         label,
                         className = "",
                         step = 1000,
                     }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
    className?: string;
    step?: number;
}) {
    const [localValue, setLocalValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            setLocalValue(formatNumber(value));
        }
    }, [value, isFocused]);

    const handleChange = (val: string) => {
        setLocalValue(val);
        const num = parseNumber(val);
        onChange(num);
    };

    const increment = () => {
        onChange(value + step);
    };

    const decrement = () => {
        onChange(Math.max(0, value - step));
    };

    return (
        <div
            className="relative flex items-center gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Input
                type="text"
                label={label}
                value={isFocused ? localValue : formatNumber(value)}
                onFocus={() => {
                    setIsFocused(true);
                    setLocalValue(value === 0 ? "" : String(value));
                }}
                onBlur={() => {
                    setIsFocused(false);
                    setLocalValue(formatNumber(value));
                }}
                onValueChange={handleChange}
                classNames={{ input: `font-bold text-md ${className}` }}
            />
            {isHovered && (
                <div className="flex flex-col gap-0.5 absolute left-0 z-10">
                    <button
                        type="button"
                        onClick={increment}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                    >
                        <Icon icon="mdi:chevron-up" width="14" height="14" />
                    </button>
                    <button
                        type="button"
                        onClick={decrement}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                    >
                        <Icon icon="mdi:chevron-down" width="14" height="14" />
                    </button>
                </div>
            )}
        </div>
    );
}

// ---------------- SortableTradeRow ----------------

function SortableTradeRow({
                              id,
                              item,
                              idx,
                              handleInputChange,
                              removeRow,
                              type,
                              list,
                          }: {
    id: string;
    item: TradeItem;
    idx: number;
    handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
    removeRow: (idx: number) => void;
    type: "buy" | "sell";
    list: TradeItem[];
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    const rowProfit =
        type === "buy"
            ? (item.currentPrice - item.price) * item.count * 1000
            : (item.price - item.currentPrice) * item.count * 1000;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div className="flex gap-1 md:flex-row flex-col items-center my-2 bg-gray-50 rounded p-2">
                <div {...listeners} className="cursor-grab select-none hover:text-blue-600">
                    <Icon icon="mdi:drag-variant" width="22" height="22" />
                </div>

                <div className="flex flex-col text-sm">
                    {["ض", "ط", "خودش"].map((side) => (
                        <label key={side} className="flex items-center gap-1">
                            <input
                                type="radio"
                                checked={item.side === side}
                                onChange={() => handleInputChange(idx, "side", side as SideType)}
                            />
                            {side}
                        </label>
                    ))}
                </div>

                <div className={'w-96'}>
                <Input
                    label="نماد"
                    value={item.symbolInput}
                    onValueChange={(val) => handleInputChange(idx, "symbolInput", val)}
                    classNames={{ input: "font-bold text-md" }}
                />
                </div>

                <NumberInput
                    label={type === "buy" ? "قیمت خرید" : "قیمت فروش"}
                    value={item.price}
                    onChange={(val) => handleInputChange(idx, "price", val)}
                />

                <NumberInput
                    label="قیمت اعمال"
                    value={item.strikePrice}
                    onChange={(val) => handleInputChange(idx, "strikePrice", val)}
                />

                <NumberInput
                    label="قیمت فعلی"
                    value={item.currentPrice}
                    onChange={(val) => handleInputChange(idx, "currentPrice", val)}
                />

                <NumberInput
                    label="تعداد"
                    value={item.count}
                    onChange={(val) => handleInputChange(idx, "count", val)}
                />

                {list.length > 1 && (
                    <button
                        onClick={() => removeRow(idx)}
                        className="px-2 py-1 text-xs text-red-600"
                    >
                        حذف
                    </button>
                )}
            </div>

            <p
                className={`md:text-xl block mt-1 ${
                    rowProfit > 0 ? "text-green-600" : "text-red-600"
                }`}
            >
                {isNaN(rowProfit) ? "نامعتبر" : rowProfit.toLocaleString("fa-IR")}
            </p>
        </div>
    );
}

// ---------------- SortableTradeList ----------------

function SortableTradeList({
                               list,
                               setList,
                               handleInputChange,
                               removeRow,
                               type,
                           }: {
    list: TradeItem[];
    setList: React.Dispatch<React.SetStateAction<TradeItem[]>>;
    handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
    removeRow: (idx: number) => void;
    type: "buy" | "sell";
}) {
    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
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

// ---------------- IndexPage ----------------

export default function IndexPage() {
    const [buyList, setBuyList] = useState<TradeItem[]>([emptyTradeItem()]);
    const [sellList, setSellList] = useState<TradeItem[]>([emptyTradeItem()]);
    const [leveragePrice, setLeveragePrice] = useState<number>(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // بارگذاری اولیه از localStorage
    useEffect(() => {
        const savedBuy = localStorage.getItem(BUY_LIST_KEY);
        const savedSell = localStorage.getItem(SELL_LIST_KEY);
        const savedLeverage = localStorage.getItem(LEVERAGE_PRICE_KEY);

        if (savedBuy) setBuyList(JSON.parse(savedBuy));
        if (savedSell) setSellList(JSON.parse(savedSell));
        if (savedLeverage) setLeveragePrice(Number(savedLeverage));

        setIsInitialized(true);
    }, []);

    const calcCurrentPrice = (item: TradeItem, lp: number) =>
        Math.max(
            1,
            item.side === "ض"
                ? lp - item.strikePrice
                : item.side === "ط"
                    ? item.strikePrice - lp
                    : lp
        );

    const updateField = (
        list: TradeItem[],
        idx: number,
        field: keyof TradeItem,
        value: any
    ) =>
        list.map((it, i) => {
            if (i !== idx) return it;

            let updatedItem = { ...it, [field]: value };

            if (field === "symbolInput") {
                const detectedSide = detectSideFromSymbol(value);
                updatedItem = { ...updatedItem, side: detectedSide };
            }

            if (field === "strikePrice" || field === "side" || field === "symbolInput") {
                updatedItem.currentPrice = calcCurrentPrice(updatedItem, leveragePrice);
            }

            return updatedItem;
        });

    const handleBuyChange = (i: number, f: keyof TradeItem, v: any) =>
        setBuyList((l) => updateField(l, i, f, v));
    const handleSellChange = (i: number, f: keyof TradeItem, v: any) =>
        setSellList((l) => updateField(l, i, f, v));

    // ذخیره در localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(BUY_LIST_KEY, JSON.stringify(buyList));
        }
    }, [buyList, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(SELL_LIST_KEY, JSON.stringify(sellList));
        }
    }, [sellList, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(LEVERAGE_PRICE_KEY, String(leveragePrice));
        }
    }, [leveragePrice, isInitialized]);

    // بروزرسانی currentPrice فقط زمانی که leveragePrice تغییر کند
    useEffect(() => {
        if (isInitialized) {
            setBuyList((l) =>
                l.map((it) => ({ ...it, currentPrice: calcCurrentPrice(it, leveragePrice) }))
            );
            setSellList((l) =>
                l.map((it) => ({ ...it, currentPrice: calcCurrentPrice(it, leveragePrice) }))
            );
        }
    }, [leveragePrice, isInitialized]);

    const calcBuyProfit = useMemo(
        () =>
            buyList.reduce(
                (sum, it) => sum + (it.currentPrice - it.price) * it.count * 1000,
                0
            ),
        [buyList]
    );
    const calcSellProfit = useMemo(
        () =>
            sellList.reduce(
                (sum, it) => sum + (it.price - it.currentPrice) * it.count * 1000,
                0
            ),
        [sellList]
    );
    const totalProfit = calcBuyProfit + calcSellProfit;

    return (
        <div className="p-4">
            <div className="flex justify-center mb-5">
                <div className="w-96">
                    <NumberInput
                        label="قیمت"
                        value={leveragePrice}
                        onChange={setLeveragePrice}
                        className="text-center text-3xl"
                    />
                </div>
            </div>

            <p
                className={`text-center md:text-5xl text-2xl ${
                    totalProfit > 0 ? "text-green-600" : "text-red-600"
                }`}
            >
                {isNaN(totalProfit) ? "نامعتبر" : totalProfit.toLocaleString("fa-IR")}
            </p>

            <div className="flex md:flex-row flex-col gap-4 mt-5">
                <div className="border-4 border-green-600 p-4 flex-1">
                    <p className="text-center text-3xl">خرید</p>
                    <SortableTradeList
                        list={buyList}
                        setList={setBuyList}
                        handleInputChange={handleBuyChange}
                        removeRow={(i) => setBuyList((l) => l.filter((_, x) => x !== i))}
                        type="buy"
                    />
                    <button
                        onClick={() => setBuyList((l) => [...l, emptyTradeItem()])}
                        className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                    >
                        اضافه ردیف
                    </button>
                    <p
                        className={`text-center md:text-4xl mt-3 ${
                            calcBuyProfit > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {formatNumber(calcBuyProfit)}
                    </p>
                </div>

                <div className="border-4 border-red-600 p-4 flex-1">
                    <p className="text-center text-3xl">فروش</p>
                    <SortableTradeList
                        list={sellList}
                        setList={setSellList}
                        handleInputChange={handleSellChange}
                        removeRow={(i) => setSellList((l) => l.filter((_, x) => x !== i))}
                        type="sell"
                    />
                    <button
                        onClick={() => setSellList((l) => [...l, emptyTradeItem()])}
                        className="bg-red-700 text-white px-3 py-1 mt-2 rounded"
                    >
                        اضافه ردیف
                    </button>
                    <p
                        className={`text-center md:text-4xl mt-3 ${
                            calcSellProfit > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {formatNumber(calcSellProfit)}
                    </p>
                </div>
            </div>
        </div>
    );
}
