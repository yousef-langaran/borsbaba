import {FieldLabel, Puck, usePuck} from "@measured/puck";
import "@measured/puck/puck.css";
import {Input, Textarea} from "@nextui-org/input";
import {Card, CardBody} from "@nextui-org/card";
import {useEffect, useState} from "react";
import conf, {initialData} from "@/components/builder/config";
import {Icon} from "@iconify/react";
import {Button, Select, SelectItem, Tab, Tabs} from "@nextui-org/react";

const JSONRenderer = () => {
    const {appState, selectedItem, history,} = usePuck();
    return <div>{JSON.stringify(appState.data)}</div>;
};

// Save the data to your database
const save = (data:any) => {
    console.log(data)
};

// Render Puck editor
export function BuilderEditor() {
    const [isSidebarLeft, setIsSidebarLeft] = useState(true)
    const [isSidebarRight, setIsSidebarRight] = useState(true)
    return (
        <Puck config={conf} data={initialData} onPublish={save} overrides={{
            components: ({children}) => (
                <div className={"customComponentsList"}>
                    {children}
                </div>
            ),
            fieldTypes: {
                text: ({name, onChange, value}) => (
                    <Input
                        defaultValue={value as any}
                        label={name}
                        onChange={(e) => onChange(e.currentTarget.value as any)}
                    />
                ),
                select: ({field, name, onChange, value}:any) => (
                    <Select label={name} selectedKeys={Array.isArray(value) ? value as any : [value]} onChange={(e) => onChange(e.target.value as any)}>
                        {Array.isArray(field?.options) && field.options.map((item:any) => (
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
                radio: ({name, onChange, value, field}:any) => (
                    <FieldLabel label={name}>
                        <Tabs selectedKey={value as any} onSelectionChange={onChange as any} fullWidth>
                            {Array.isArray(field?.options) && field.options.map((item:any) => (
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
                                <div className={"flex gap-2"}>
                                    <Button onClick={() => setIsSidebarLeft(!isSidebarLeft)} variant={"light"}
                                            isIconOnly size={"sm"}>
                                        <Icon className={"rotate-180"} icon={"solar:sidebar-minimalistic-broken"}
                                              fontSize={20}/>
                                    </Button>
                                    <Button onClick={() => setIsSidebarRight(!isSidebarRight)} variant={"light"}
                                            isIconOnly size={"sm"}>
                                        <Icon icon={"solar:sidebar-minimalistic-broken"} fontSize={20}/>
                                    </Button>
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
                    <Card className={"grow"}>
                        <CardBody>
                            <Puck.Preview/>
                        </CardBody>
                    </Card>
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
    )
}