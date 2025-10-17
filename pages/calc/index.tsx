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

// ---------------- نوع داده ----------------
type SideType = "ط" | "ض" | "خودش";

interface TradeItem {
  symbolInput: string;
  price: number;
  strikePrice: number;
  currentPrice: number;
  count: number;
  side: SideType;
}

const formatNumber = (val: number | string) => {
  if (val === "" || val == null || isNaN(Number(val))) return "";
  return Number(val).toLocaleString("fa-IR");
};

const emptyTradeItem = (): TradeItem => ({
  symbolInput: "",
  price: 0,
  strikePrice: 0,
  currentPrice: 0,
  count: 0,
  side: "خودش",
});

// ---------------- کامپوننت ورودی عددی پایدار ----------------
function NumericInput({
  label,
  value,
  onChange,
  step = 1000,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
}) {
  const [display, setDisplay] = useState(formatNumber(value));
  const [raw, setRaw] = useState(String(value));

  const handleChange = (val: string) => {
    const clean = val.replace(/[^\d]/g, "");
    setRaw(clean);
    setDisplay(clean);
  };

  const handleBlur = () => {
    const num = Number(raw);
    const fmt = formatNumber(num);
    setDisplay(fmt);
    onChange(num);
  };

  const handleFocus = () => {
    setDisplay(raw);
  };

  useEffect(() => {
    setDisplay(formatNumber(value));
    setRaw(String(value));
  }, [value]);

  return (
    <Input
      label={label}
      type="text"
      step={step}
      value={display}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onValueChange={handleChange}
      classNames={{ input: "text-center" }}
    />
  );
}

// ---------------- کامپوننت ردیف قابل مرتب شدن ----------------
function SortableTradeRow({
  id,
  item,
  idx,
  handleChange,
  removeRow,
  type,
  list,
}: {
  id: string;
  item: TradeItem;
  idx: number;
  handleChange: (
    i: number,
    field: keyof TradeItem,
    val: string | number
  ) => void;
  removeRow: (i: number) => void;
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
      <div className="flex flex-wrap items-center gap-2 my-2 bg-gray-50 rounded p-2">
        <div {...listeners} className="cursor-grab text-blue-600">
          <Icon icon="mdi:drag-variant" width="22" height="22" />
        </div>

        <Input
          label="نماد"
          value={item.symbolInput}
          onValueChange={(v) => handleChange(idx, "symbolInput", v)}
        />

        <NumericInput
          label={type === "buy" ? "قیمت خرید" : "قیمت فروش"}
          value={item.price}
          onChange={(v) => handleChange(idx, "price", v)}
        />

        <NumericInput
          label="قیمت اعمال"
          value={item.strikePrice}
          onChange={(v) => handleChange(idx, "strikePrice", v)}
        />

        <NumericInput
          label="قیمت فعلی"
          value={item.currentPrice}
          onChange={(v) => handleChange(idx, "currentPrice", v)}
        />

        <NumericInput
          label="تعداد"
          value={item.count}
          onChange={(v) => handleChange(idx, "count", v)}
        />

        <div className="flex flex-col">
          {(["ض", "ط", "خودش"] as const).map((s) => (
            <label key={s} className="flex items-center gap-1">
              <input
                type="radio"
                name={`side-${idx}`}
                checked={item.side === s}
                onChange={() => handleChange(idx, "side", s)}
              />{" "}
              {s}
            </label>
          ))}
        </div>

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
        className={`text-xl mt-1 ${
          +rowProfit > 0 ? "text-success" : "text-danger"
        }`}
      >
        {isNaN(rowProfit) ? "نامعتبر" : formatNumber(rowProfit)}
      </div>
    </div>
  );
}

// ---------------- کامپوننت اصلی صفحه ----------------
export default function IndexPage() {
  // خواندن از localStorage در لحظه‌ی mount
  const [buyList, setBuyList] = useState<TradeItem[]>(() => {
    const stored = localStorage.getItem("buyList");
    return stored ? JSON.parse(stored) : [emptyTradeItem()];
  });

  const [sellList, setSellList] = useState<TradeItem[]>(() => {
    const stored = localStorage.getItem("sellList");
    return stored ? JSON.parse(stored) : [emptyTradeItem()];
  });

  const [leveragePrice, setLeveragePrice] = useState(() => {
    const stored = localStorage.getItem("leveragePrice");
    return stored ? Number(stored) : 0;
  });

  // به‌روزرسانی localStorage هنگام تغییر state‌ها
  useEffect(() => {
    localStorage.setItem("buyList", JSON.stringify(buyList));
    localStorage.setItem("sellList", JSON.stringify(sellList));
    localStorage.setItem("leveragePrice", leveragePrice.toString());
  }, [buyList, sellList, leveragePrice]);

  const sensors = useSensors(useSensor(PointerSensor));

  const calcCurrentPrice = (item: TradeItem, lp: number) => {
    if (item.side === "ض") return Math.max(1, lp - item.strikePrice);
    if (item.side === "ط") return Math.max(1, item.strikePrice - lp);
    return Math.max(1, lp);
  };

  useEffect(() => {
    setBuyList((list) =>
      list.map((it) => ({
        ...it,
        currentPrice: calcCurrentPrice(it, leveragePrice),
      }))
    );
    setSellList((list) =>
      list.map((it) => ({
        ...it,
        currentPrice: calcCurrentPrice(it, leveragePrice),
      }))
    );
  }, [leveragePrice]);

  const handleChangeBuy = (
    i: number,
    field: keyof TradeItem,
    val: string | number
  ) => {
    setBuyList((list) => {
      const newList = [...list];
      newList[i] = { ...newList[i], [field]: val };
      return newList;
    });
  };

  const handleChangeSell = (
    i: number,
    field: keyof TradeItem,
    val: string | number
  ) => {
    setSellList((list) => {
      const newList = [...list];
      newList[i] = { ...newList[i], [field]: val };
      return newList;
    });
  };

  const addRowBuy = () => setBuyList((l) => [...l, emptyTradeItem()]);
  const addRowSell = () => setSellList((l) => [...l, emptyTradeItem()]);
  const removeRowBuy = (i: number) =>
    setBuyList((l) => (l.length > 1 ? l.filter((_, x) => x !== i) : l));
  const removeRowSell = (i: number) =>
    setSellList((l) => (l.length > 1 ? l.filter((_, x) => x !== i) : l));

  const calcBuy = useMemo(
    () =>
      buyList.reduce(
        (a, it) =>
          a + (it.currentPrice - it.price) * it.count * 1000 || 0,
        0
      ),
    [buyList]
  );

  const calcSell = useMemo(
    () =>
      sellList.reduce(
        (a, it) =>
          a + (it.price - it.currentPrice) * it.count * 1000 || 0,
        0
      ),
    [sellList]
  );

  const totalProfit = calcBuy + calcSell;

  const handleDragEnd = (event: any, list: TradeItem[], setList: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    setList(arrayMove(list, oldIndex, newIndex));
  };

  // ---------------- رندر ----------------
  return (
    <div className="p-4">
      <div className="flex justify-center mb-6">
        <NumericInput
          label="قیمت"
          value={leveragePrice}
          onChange={(v) => setLeveragePrice(v)}
        />
      </div>

      <p
        className={`md:text-5xl text-2xl text-center ${
          +totalProfit > 0 ? "text-success" : "text-danger"
        }`}
      >
        {isNaN(totalProfit) ? "نامعتبر" : formatNumber(totalProfit)}
      </p>

      <div className="w-full flex md:flex-row flex-col gap-6">
        {/* بخش خرید */}
        <div className="border-4 border-success p-4 w-full">
          <p className="text-xl text-center">خرید</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, buyList, setBuyList)}
          >
            <SortableContext
              items={buyList.map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              {buyList.map((item, idx) => (
                <SortableTradeRow
                  key={idx}
                  id={idx.toString()}
                  item={item}
                  idx={idx}
                  handleChange={handleChangeBuy}
                  removeRow={removeRowBuy}
                  type="buy"
                  list={buyList}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            className="my-2 bg-green-700 text-white px-3 py-1 rounded"
            onClick={addRowBuy}
          >
            اضافه ردیف
          </button>

          <p
            className={`text-xl text-center ${
              +calcBuy > 0 ? "text-success" : "text-danger"
            }`}
          >
            {formatNumber(calcBuy)}
          </p>
        </div>

        {/* بخش فروش */}
        <div className="border-4 border-danger p-4 w-full">
          <p className="text-xl text-center">فروش</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, sellList, setSellList)}
          >
            <SortableContext
              items={sellList.map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              {sellList.map((item, idx) => (
                <SortableTradeRow
                  key={idx}
                  id={idx.toString()}
                  item={item}
                  idx={idx}
                  handleChange={handleChangeSell}
                  removeRow={removeRowSell}
                  type="sell"
                  list={sellList}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            className="my-2 bg-red-700 text-white px-3 py-1 rounded"
            onClick={addRowSell}
          >
            اضافه ردیف
          </button>

          <p
            className={`text-xl text-center ${
              +calcSell > 0 ? "text-success" : "text-danger"
            }`}
          >
            {formatNumber(calcSell)}
          </p>
        </div>
      </div>
    </div>
  );
}
