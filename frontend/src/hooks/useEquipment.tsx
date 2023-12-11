import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Equipment, EquipmentSet, EquipmentsResponse, EquipmentSetResponse, EquipmentResponse } from "../types/types";
import axiosPrivate from "../api/axios";

const EQUIPMENT_URL = "/equipment/";
const SETS_URL = EQUIPMENT_URL + "sets/";

const useEquipment = () => {
    const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
    const [equipmentSets, setEquipmentSets] = useState<EquipmentSet[]>([]);

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

    const fetchEquipmentSetsByCompanyId = async (companyId: number) => {
        try {
            const response = await axiosPrivate.get<EquipmentSetResponse>(`${SETS_URL}${companyId}`);
            setEquipmentSets(response.data.equipmentSets);
        } catch (error: any) {
            toast.error("Failed to fetch equipment sets by company ID");
        }
    };

    useEffect(() => {
        fetchAllEquipments();
    }, []);

    return {
        equipmentData,
        equipmentSets,
        fetchEquipmentById,
        fetchEquipmentSetsByCompanyId
    };
};

export default useEquipment;
