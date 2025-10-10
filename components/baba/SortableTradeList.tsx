import {TradeItem} from "@/pages";
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Input} from "@nextui-org/input";

export const SortableTradeList = ({
                               list,
                               setList,
                               handleInputChange,
                               removeRow,
                               type,
                               mounted
                           }: {
    list: TradeItem[];
    setList: React.Dispatch<React.SetStateAction<TradeItem[]>>;
    handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
    removeRow: (idx: number) => void;
    type: "buy" | "sell";
    mounted: boolean;
}) => {
    const sensors = useSensors(useSensor(PointerSensor));

    function SortableTradeRow({
                                  id,
                                  item,
                                  idx,
                                  list,
                                  handleInputChange,
                                  removeRow,
                                  type,
                                  mounted
                              }: {
        id: string;
        item: TradeItem;
        idx: number;
        list: TradeItem[];
        handleInputChange: (idx: number, field: keyof TradeItem, value: any) => void;
        removeRow: (idx: number) => void;
        type: "buy" | "sell";
        mounted: boolean;
    }) {
        const {attributes, listeners, setNodeRef, transform, transition} =
            useSortable({id});

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: "grab"
        };

        const rowProfit =
            type === "buy"
                ? ((item.nowPrice?.pDrCotVal ?? 0) - item.price) * item.count * 1000
                : (item.price - (item.nowPrice?.pDrCotVal ?? 0)) * item.count * 1000;

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <div className="flex gap-2 md:flex-row flex-col items-center my-2 bg-gray-50 rounded p-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <Autocomplete
                        label={"نماد"}
                        onInputChange={val => handleInputChange(idx, "symbolInput", val)}
                        isLoading={item.loading}
                        onSelectionChange={val => handleInputChange(idx, "selected", val)}
                        selectedKey={item.selected?.toString()}
                    >
                        {item.options.map(opt => (
                            <AutocompleteItem key={opt.insCode}>{opt.lVal18AFC}</AutocompleteItem>
                        ))}
                    </Autocomplete>

                    <Input
                        onValueChange={val => handleInputChange(idx, "description", val)}
                        value={item.description ? String(item.description) : ""}
                    />
                    <Input
                        onValueChange={val => handleInputChange(idx, "price", Number(val))}
                        type={"number"}
                        label={"قیمت"}
                        value={item.price ? String(item.price) : ""}
                    />
                    <Input
                        onValueChange={val => handleInputChange(idx, "count", Number(val))}
                        type={"number"}
                        label={"تعداد"}
                        value={item.count ? String(item.count) : ""}
                    />
                    <span
                        className={`text-lg ${
                            type === "buy" ? "text-success" : "text-danger"
                        }`}
                    >
          {mounted ? (item.nowPrice?.pDrCotVal || 0).toLocaleString() : ""}
        </span>
                    {(list.length > 1) && (
                        <button onClick={() => removeRow(idx)} className="text-xs text-red-700 px-2 py-1">
                            حذف
                        </button>
                    )}
                </div>

                <div className={`md:text-2xl block mt-1 ${+rowProfit > 0 ? "text-success" : "text-danger"}`}>
                    {mounted ? (isNaN(rowProfit) ? "نامعتبر" : rowProfit.toLocaleString()) : ""}
                </div>
            </div>
        );
    }

    const handleDragEnd = (event: any) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex = list.findIndex((_, i) => i.toString() === active.id);
            const newIndex = list.findIndex((_, i) => i.toString() === over?.id);
            setList(items => arrayMove(items, oldIndex, newIndex));
        }
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
                        list={list}
                        handleInputChange={handleInputChange}
                        removeRow={removeRow}
                        type={type}
                        mounted={mounted}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
}
