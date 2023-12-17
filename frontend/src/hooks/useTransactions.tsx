import { useEffect, useState } from "react";
import { Transactions } from "../types/types";
import { toast } from "react-toastify";
import axiosPrivate from "../api/axios";

const USER_URL = "/user/"

const useTransactions = () => {
    const [tableData, setTableData] = useState<Transactions[]>([]);

    const findUserTransactions = async () => {
        try {
            const response = await axiosPrivate.get(`${USER_URL}transactions`);
            setTableData(response.data.transactions)
        } catch (error: any) {
            toast.error("Failed to fetch schedule data");
        }
    }
    useEffect(() => {
        findUserTransactions()
    }, [])

    return {
        tableData,
        findUserTransactions,
    };
};

export default useTransactions;