import {FieldLabel, Puck, usePuck,} from "@measured/puck";
import "@measured/puck/puck.css";
import {Input, Textarea} from "@nextui-org/input";
import {Card, CardBody} from "@nextui-org/card";
import {useState} from "react";
import conf from "@/components/builder/config";
import {Icon} from "@iconify/react";
import {Button, Select, SelectItem, Tab, Tabs} from "@nextui-org/react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";

interface BuilderEditorProps {
    onPublish?: (data: any) => void
    initialData?: any,
    isLoadingPublish?: boolean
}

const PublishButton = ({onPublish, isLoading}: any) => {
    const {appState} = usePuck();
    return (
        <Button isLoading={isLoading} onPress={() => onPublish(appState)} color={"primary"}>
            Publish
        </Button>
    )
};
const BackForward = () => {
    const {history} = usePuck()
    return (
        <div className={"flex items-center gap-2"}>
            <Button onPress={() => history.forward()} size={"sm"}>
                <span>بعدی</span>
                <Icon icon={"solar:undo-left-round-broken"} fontSize={20}/>
            </Button>
            <Button onPress={() => history.back()} size={"sm"}>
                <span>قبلی</span>
                <Icon icon={"solar:undo-right-round-broken"} fontSize={20}/>
            </Button>
        </div>
    )
}

export function BuilderEditor({onPublish, initialData, isLoadingPublish}: BuilderEditorProps) {
    const [isSidebarLeft, setIsSidebarLeft] = useState(true)
    const [isSidebarRight, setIsSidebarRight] = useState(true)
    const ModalBreakpoints = useDisclosure()
    // —————————————————————————————
    // ۱) مدیریت Breakpoints
    // —————————————————————————————
    type BP = { label: string; width: number };

    // اگر از سرور قبلا داشته‌ایم:
    const defaultBps: BP[] = initialData.breakpoints || [
        {label: "Desktop", width: 1200},
        {label: "Tablet", width: 768},
        {label: "Mobile", width: 375},
    ];
    const [breakpoints, setBreakpoints] = useState<BP[]>(defaultBps);
    // نگهداری state جداگانه‌ی Puck برای هر breakpoint:
    const [statesByBp, setStatesByBp] = useState<{
        [width: number]: any;
    }>(initialData.pages || {});
    // کدام breakpoint الان فعال است:
    const [currentBpIndex, setCurrentBpIndex] = useState(0);

    // برای افزودن/ویرایش Breakpoint از Modal استفاده می‌کنیم
    const [bpModalOpen, setBpModalOpen] = useState(false);
    const [bpForm, setBpForm] = useState<BP>({label: "", width: 0});
    const [bpEditIndex, setBpEditIndex] = useState<number | null>(null);
    const handlePublish = (form: any) => {
        // اول وضعیت فعلی رو ذخیره کن
        const curBp = breakpoints[currentBpIndex];
        setStatesByBp((p) => ({
            ...p,
            [curBp.width]: form.data,
        }));
        // بعد شات نهایی رو بفرست:
        const payload = {
            breakpoints,
            pages: {
                // pages[width] = stateJson
                ...statesByBp,
                [curBp.width]: form.data,
            },
        };
        onPublish?.(payload);
    };
    const openAddBp = () => {
        setBpForm({label: "", width: 0});
        setBpEditIndex(null);
        ModalBreakpoints.onOpen()
    };
    const confirmBp = () => {
        const {label, width} = bpForm;
        if (!label || width <= 0) return;
        setBreakpoints((old) => {
            const copy = [...old];
            if (bpEditIndex !== null) {
                copy[bpEditIndex] = {label, width};
            } else {
                copy.push({label, width});
            }
            return copy;
        });
        setBpModalOpen(false);
    };
    return (
        <>
            <Puck key={currentBpIndex} config={conf} data={statesByBp[breakpoints[currentBpIndex].width]} overrides={{
                components: ({children}) => (
                    <div className={"customComponentsList"}>
                        {children}
                    </div>
                ),
                componentItem: ({name}) => (
                    <Card>
                        <CardBody>
                            {name}
                        </CardBody>
                    </Card>
                ),
                fieldTypes: {
                    text: ({name, onChange, value}) => (
                        <Input
                            defaultValue={value as any}
                            label={name}
                            onChange={(e) => onChange(e.currentTarget.value as any)}
                        />
                    ),
                    select: ({field, name, onChange, value}: any) => (
                        <Select label={name} selectedKeys={Array.isArray(value) ? value as any : [value]}
                                onChange={(e) => onChange(e.target.value as any)}>
                            {Array.isArray(field?.options) && field.options.map((item: any) => (
                                <SelectItem key={item?.value}>{item?.label}</SelectItem>
                            ))}
                        </Select>
                    ),
                    textarea: ({name, onChange, value}) => (
                        <Textarea
                            defaultValue={value as any}
                            label={name}
                            onChange={(e) => onChange(e.currentTarget.value as any)}
                        />
                    ),
                    radio: ({name, onChange, value, field}: any) => (
                        <FieldLabel label={name}>
                            <Tabs selectedKey={value as any} onSelectionChange={onChange as any} fullWidth>
                                {Array.isArray(field?.options) && field.options.map((item: any) => (
                                    <Tab key={item?.value} title={item?.label}/>
                                ))}
                            </Tabs>
                        </FieldLabel>
                    )
                },
            }}>
                <div className={"p-4 flex flex-col gap-4 h-screen"}>
                    <div>
                        <Card>
                            <CardBody>
                                <div className={"flex justify-between items-center"}>
                                    <div>
                                        <h1 className={"text-xl font-bold"}>
                                            Usef Builder
                                        </h1>
                                    </div>
                                    <div className={"flex gap-2 items-center"}>
                                        <BackForward/>
                                        <Button onPress={() => setIsSidebarLeft(!isSidebarLeft)} variant={"light"}
                                                isIconOnly size={"sm"}>
                                            <Icon className={"rotate-180"} icon={"solar:sidebar-minimalistic-broken"}
                                                  fontSize={20}/>
                                        </Button>
                                        <Button onPress={() => setIsSidebarRight(!isSidebarRight)} variant={"light"}
                                                isIconOnly size={"sm"}>
                                            <Icon icon={"solar:sidebar-minimalistic-broken"} fontSize={20}/>
                                        </Button>
                                        <Button color="primary" onPress={ModalBreakpoints.onOpen}>
                                            مدیریت Breakpoints
                                        </Button>
                                        <PublishButton onPublish={handlePublish} isLoading={isLoadingPublish}/>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className={"flex gap-2 max-h-full h-full"}>
                        {isSidebarLeft &&
                            <Card className={"w-96"}>
                                <div className={"max-h-[70%] overflow-auto"}>
                                    <div className={"bg-content3 p-4 font-bold"}>Blocks</div>
                                    <div className={"p-4"}>
                                        <Puck.Components/>
                                    </div>
                                </div>
                                <div className={"max-h-[30%] overflow-auto"}>
                                    <div className={"bg-content3 p-4 font-bold"}>Outline</div>
                                    <div className={"p-4"}>
                                        <Puck.Outline/>
                                    </div>
                                </div>
                            </Card>
                        }
                        <div className={"grow flex flex-col gap-2"}>
                            {/* ——————————— صفحات Breakpoint ——————————— */}
                            <Tabs
                                selectedKey={currentBpIndex.toString()}
                                onSelectionChange={(k) => setCurrentBpIndex(Number(k))}
                            >
                                {breakpoints.map((bp, i) => (
                                    <Tab key={i} title={`${bp.label} (${bp.width}px)`}/>
                                ))}
                            </Tabs>
                            <Card className={"grow"}>
                                <CardBody>
                                    <Puck.Preview/>
                                </CardBody>
                            </Card>
                        </div>
                        {isSidebarRight && (
                            <Card className="w-96">
                                <CardBody>
                                    <Puck.Fields/>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </Puck>

            <Modal onOpenChange={ModalBreakpoints.onOpenChange} isOpen={ModalBreakpoints.isOpen}
                   onClose={ModalBreakpoints.onClose}>
                <ModalContent>
                    <ModalHeader>
                        <p>{bpEditIndex === null ? "افزودن Breakpoint" : "ویرایش Breakpoint"}</p>
                    </ModalHeader>
                    <ModalBody className="space-y-4">
                        <Input
                            fullWidth
                            label="نام"
                            value={bpForm.label}
                            onChange={(e) =>
                                setBpForm((p) => ({...p, label: e.target.value}))
                            }
                        />
                        <Input
                            fullWidth
                            type="number"
                            label="عرض (px)"
                            value={bpForm.width.toString() || ""}
                            onChange={(e) =>
                                setBpForm((p) => ({...p, width: Number(e.target.value)}))
                            }
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color={"danger"} onPress={() => setBpModalOpen(false)}>
                            انصراف
                        </Button>
                        <Button onPress={confirmBp}>
                            تایید
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}