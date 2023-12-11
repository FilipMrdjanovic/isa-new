import { useState } from "react";
import { toast } from "react-toastify";
import axiosPrivate from "../api/axios";
import { Equipment, EquipmentsResponse, EquipmentResponse } from "../types/types";

const EQUIPMENT_URL = "/equipment/";

const useEquipment = () => {
    const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
    const fetchAllEquipments = async () => {
        try {
            const response = await axiosPrivate.get<EquipmentsResponse>(EQUIPMENT_URL + "all");
            setEquipmentData(response.data.equipments);
        } catch (error: any) {
            toast.error("Failed to fetch equipment data");
        }
    };

    const fetchEquipmentById = async (id: number) => {
        try {
            const response = await axiosPrivate.get<EquipmentResponse>(`${EQUIPMENT_URL}${id}`);
            return response.data.equipment;
        } catch (error: any) {
            toast.error("Failed to fetch equipment by ID");
            return null;
        }
    };
    return {
        equipmentData,
        fetchAllEquipments,
        fetchEquipmentById
    };
}
export default useEquipment;