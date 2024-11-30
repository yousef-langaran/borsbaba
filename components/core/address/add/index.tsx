import {Modal, ModalBody, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {useEffect, useRef} from "react"
import {Map} from "@neshan-maps-platform/ol"
import NeshanMap, {NeshanMapRef} from "@neshan-maps-platform/react-openlayers"
import {Button} from "@nextui-org/button";

const mapKey = "web.3285b73742624f1f9b5245178ae5c537"
const serviceKey = "service.5f5aa6caaebf45d9b7d17a8b93dbe605"
export const AddressAdd = () => {
    const mapRef = useRef<NeshanMapRef | null>(null)

    const onInit = (map: Map) => {
        map.setMapType("osm-bright")
        map.switchTrafficLayer(true)
    }

    useEffect(() => {
        if (mapRef.current?.map) {
            mapRef.current?.map.switchTrafficLayer(true)
            mapRef.current?.map.setMapType("standard-night")
        }
    }, [])

    return (
        <Modal isOpen={true}>
            <ModalHeader>
                <div>
                    <h2 className="font-bold">انتخاب آدرس روی نقشه</h2>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className="w-full h-96 rounded-xl overflow-hidden">
                    <NeshanMap
                        mapKey={mapKey}
                        defaultType="neshan"
                        center={{latitude: 35.7665394, longitude: 51.4749824}}
                        style={{height: "48vh", width: "100%"}}
                        onInit={onInit}
                        zoom={13}
                        traffic={false}
                        poi={false}
                    ></NeshanMap>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="flex justify-end gap-4">
                    <Button>بستن</Button>
                    <Button>تایید و ادامه</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}