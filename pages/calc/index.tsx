import {useState, useEffect, useMemo} from 'react';
import {Input} from '@nextui-org/input';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
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

interface NumericField {
  raw: string;       // عدد خام برای محاسبه
  display: string;   // مقدار نمایش داده شده
}

type TradeItem = {
  symbolInput: string;
  loading: boolean;
  options: SymbolItem[];
  selected: number | null;
  price: NumericField;
  currentPrice: NumericField;
  count: NumericField;
  strikePrice: NumericField;
  side: SideType;
};

const emptyNumericField = (): NumericField => ({ raw: '0', display: '0' });
const emptyTradeItem = (): TradeItem => ({
  symbolInput: '',
  loading: false,
  options: [],
  selected: null,
  price: emptyNumericField(),
  currentPrice: emptyNumericField(),
  count: emptyNumericField(),
  strikePrice: emptyNumericField(),
  side: 'خودش'
});

const formatNumber = (num: string | number) => {
  if (num === '' || num == null || isNaN(Number(num))) return '';
  return Number(num).toLocaleString('fa-IR');
};

function useNumericField(initial: number | string) {
  const [raw, setRaw] = useState(String(initial));
  const [display, setDisplay] = useState(formatNumber(initial));

  const onFocus = () => setDisplay(raw);
  const onBlur = () => setDisplay(formatNumber(raw));
  const onChange = (val: string) => {
    const clean = val.replace(/[^\d]/g, '');
    setRaw(clean);
    setDisplay(clean);
  };

  return { raw, display, onChange, onFocus, onBlur };
}

function SortableTradeRow({
  id,
  item,
  idx,
  handleNumericChange,
  handleStringChange,
  removeRow,
  type,
  list
}: {
  id: string;
  item: TradeItem;
  idx: number;
  handleNumericChange: (
    i: number,
    field: keyof Omit<TradeItem, 'symbolInput'|'loading'|'options'|'selected'|'side'>,
    raw: string
  ) => void;
  handleStringChange: (i: number, field: keyof TradeItem, val: any) => void;
  removeRow: (idx: number) => void;
  type: 'buy' | 'sell';
  list: TradeItem[];
}) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  const rowProfit =
    type === 'buy'
      ? ((+item.currentPrice.raw) - (+item.price.raw)) * (+item.count.raw) * 1000
      : ((+item.price.raw) - (+item.currentPrice.raw)) * (+item.count.raw) * 1000;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex flex-wrap items-center gap-3 my-2 bg-gray-50 rounded p-2">
        <div {...listeners} className="cursor-grab text-blue-600">
          <Icon icon="mdi:drag-variant" width="22" height="22" />
        </div>

        <Input
          label="نماد"
          value={item.symbolInput}
          onValueChange={(val) => handleStringChange(idx, 'symbolInput', val)}
        />

        {(['price','strikePrice','currentPrice','count'] as const).map(field => (
          <NumericInput
            key={field}
            label={
              field === 'price'
                ? (type === 'buy' ? 'قیمت خرید' : 'قیمت فروش')
                : field === 'strikePrice'
                  ? 'قیمت اعمال'
                  : field === 'currentPrice'
                    ? 'قیمت فعلی'
                    : 'تعداد'
            }
            field={item[field]}
            onChange={(val) => handleNumericChange(idx, field, val)}
          />
        ))}

        {/* نوع معامله */}
        <div className="flex flex-col">
          {(['ض','ط','خودش'] as const).map(s => (
            <label key={s} className="flex items-center gap-2">
              <input
                type="radio"
                name={`side-${idx}`}
                checked={item.side === s}
                onChange={() => handleStringChange(idx, 'side', s)}
              /> {s}
            </label>
          ))}
        </div>

        {list.length > 1 && (
          <button onClick={() => removeRow(idx)} className="text-xs text-red-700 px-2 py-1">
            حذف
          </button>
        )}
      </div>

      <div className={`md:text-2xl mt-1 ${+rowProfit > 0 ? 'text-success' : 'text-danger'}`}>
        {isNaN(rowProfit) ? 'نامعتبر' : formatNumber(rowProfit)}
      </div>
    </div>
  );
}

function NumericInput({
  label,
  field,
  onChange
}: {
  label: string;
  field: NumericField;
  onChange: (raw: string) => void;
}) {
  const [display, setDisplay] = useState(field.display);
  const [raw, setRaw] = useState(field.raw);

  const handleChange = (val: string) => {
    const clean = val.replace(/[^\d]/g, '');
    setRaw(clean);
    setDisplay(clean);
    onChange(clean);
  };
  const handleBlur = () => setDisplay(formatNumber(raw));
  const handleFocus = () => setDisplay(raw);

  useEffect(() => setDisplay(field.display), [field.display]);

  return (
    <Input
      type="text"
      step={1000}
      label={label}
      value={display}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onValueChange={handleChange}
      classNames={{input:'text-center'}}
    />
  );
}

export default function IndexPage() {
  const [buyList, setBuyList] = useState<TradeItem[]>([emptyTradeItem()]);
  const [sellList, setSellList] = useState<TradeItem[]>([emptyTradeItem()]);
  const leverageField = useNumericField(0);

  const handleNumericChange = (listType: 'buy'|'sell') => (idx: number, field: keyof Omit<TradeItem,'symbolInput'|'loading'|'options'|'selected'|'side'>, raw: string) => {
    const setFunc = listType === 'buy' ? setBuyList : setSellList;
    setFunc(list => {
      const updated = [...list];
      updated[idx] = {...updated[idx], [field]: {...updated[idx][field], raw, display: formatNumber(raw)}};
      return updated;
    });
  };

  const handleStringChange = (listType: 'buy'|'sell') => (idx: number, field: keyof TradeItem, val: any) => {
    const setFunc = listType === 'buy' ? setBuyList : setSellList;
    setFunc(list => {
      const updated = [...list];
      updated[idx] = {...updated[idx], [field]: val};
      return updated;
    });
  };

  const calcCurrentPrice = (it: TradeItem) => {
    const lp = +leverageField.raw;
    const sp = +it.strikePrice.raw;
    if (it.side === 'ض') return Math.max(1, lp - sp);
    if (it.side === 'ط') return Math.max(1, sp - lp);
    return Math.max(1, lp);
  };

  // بروزرسانی قیمت فعلی با leverage
  useEffect(() => {
    setBuyList(list => list.map(it => ({...it, currentPrice: { raw: String(calcCurrentPrice(it)), display: formatNumber(calcCurrentPrice(it)) }})));
    setSellList(list => list.map(it => ({...it, currentPrice: { raw: String(calcCurrentPrice(it)), display: formatNumber(calcCurrentPrice(it)) }})));
  }, [leverageField.raw]);

  const calcBuy = useMemo(() => buyList.reduce((a, it) => a + (((+it.currentPrice.raw - +it.price.raw) * +it.count.raw * 1000) || 0), 0), [buyList]);
  const calcSell = useMemo(() => sellList.reduce((a, it) => a + (((+it.price.raw - +it.currentPrice.raw) * +it.count.raw * 1000) || 0), 0), [sellList]);
  const totalProfit = calcBuy + calcSell;

  return (
    <div className="p-4">
      <div className="flex justify-center mb-6">
        <Input
          type="text"
          step={1000}
          label="قیمت"
          value={leverageField.display}
          onValueChange={leverageField.onChange}
          onFocus={leverageField.onFocus}
          onBlur={leverageField.onBlur}
          size="lg"
          classNames={{input:'text-center text-3xl font-bold'}}
        />
      </div>

      <p className={`md:text-5xl text-2xl text-center ${totalProfit>0?'text-success':'text-danger'}`}>
        {isNaN(totalProfit)?'نامعتبر':formatNumber(totalProfit)}
      </p>

      <div className="w-full flex md:flex-row flex-col gap-6">
        <TradeSection
          type="buy"
          list={buyList}
          setList={setBuyList}
          handleNumericChange={handleNumericChange('buy')}
          handleStringChange={handleStringChange('buy')}
          calcTotal={calcBuy}
        />
        <TradeSection
          type="sell"
          list={sellList}
          setList={setSellList}
          handleNumericChange={handleNumericChange('sell')}
          handleStringChange={handleStringChange('sell')}
          calcTotal={calcSell}
        />
      </div>
    </div>
  );
}

function TradeSection({
  type,
  list,
  setList,
  handleNumericChange,
  handleStringChange,
  calcTotal
}: {
  type:'buy'|'sell';
  list:TradeItem[];
  setList:React.Dispatch<React.SetStateAction<TradeItem[]>>;
  handleNumericChange:(idx:number,field:any,raw:string)=>void;
  handleStringChange:(idx:number,field:any,val:any)=>void;
  calcTotal:number;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event:any)=>{
    const {active,over}=event;
    if(!over||active.id===over.id)return;
    const oldIndex=Number(active.id);
    const newIndex=Number(over.id);
    setList(list=>arrayMove(list,oldIndex,newIndex));
  };
  const addRow = () => setList(list => [...list, emptyTradeItem()]);
  const removeRow = (i:number) => setList(list => list.length>1?list.filter((_,x)=>x!==i):list);

  return (
    <div className={`border-4 ${type==='buy'?'border-success':'border-danger'} p-4 w-full`}>
      <p className="md:text-5xl text-xl text-center">{type==='buy'?'خرید':'فروش'}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={list.map((_,i)=>i.toString())} strategy={verticalListSortingStrategy}>
          {list.map((item,idx)=>(
            <SortableTradeRow
              key={idx}
              id={idx.toString()}
              item={item}
              idx={idx}
              handleNumericChange={handleNumericChange}
              handleStringChange={handleStringChange}
              removeRow={removeRow}
              type={type}
              list={list}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        className={`my-2 ${type==='buy'?'bg-green-600':'bg-red-700'} text-white px-3 py-1 rounded`}
        onClick={addRow}
      >
        اضافه ردیف
      </button>

      <p className={`md:text-5xl text-2xl text-center mt-3 ${calcTotal>0?'text-success':'text-danger'}`}>
        {isNaN(calcTotal)?'نامعتبر':formatNumber(calcTotal)}
      </p>
    </div>
  );
}
