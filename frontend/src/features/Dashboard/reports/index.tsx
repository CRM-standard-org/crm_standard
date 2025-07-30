import { useEffect, useState } from "react";

// import { getQuotationData } from "@/services/ms.quotation.service.ts";
;
import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { OptionColorType } from "@/components/customs/tagCustomer/tagselect.main.component";
import { TypeAddressResponse } from "@/types/response/response.address";
import { OptionType } from "@/components/customs/select/select.main.component";

import { IoFlagOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { MdOutlineGroups, MdOutlineStarOutline } from "react-icons/md";
import { FaUserTag } from "react-icons/fa6";
import { LiaSellsy } from "react-icons/lia";

type dateTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeColorAllResponse; //ตรงนี้
}[];



export default function Reports() {
    const [searchText, setSearchText] = useState("");

    // variable form create customer 




    // const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();
    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const [allQuotation, setAllQuotation] = useState<any[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);

    //searchText control



    return (
        <>
            <h1 className="text-2xl font-bold mb-3">รายงาน</h1>


            <div className=" bg-white shadow-md rounded-lg">
                <div className="p-2 bg-sky-100 rounded-t-lg">
                    <p className="text-center text-2xl font-semibold">เลือกแม่แบบจัดทำรายงาน</p>
                </div>
                <div className="p-7 pb-5 w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Link to="/report-years">
                            <div className="flex flex-col items-center py-10  bg-white border duration-200 hover:bg-sky-100/50 shadow-md rounded-lg min-h-[300px]">


                                <IoFlagOutline style={{ fontSize: "150px" }} />
                                <p className="text-xl mt-3">รายงานยอดขายประจำปี</p>


                            </div>
                        </Link>
                        <Link to="/summary-sale">
                            <div className="flex flex-col items-center py-10 bg-white border duration-200 hover:bg-sky-100/50 shadow-md rounded-lg min-h-[300px]">

                                <FiTarget style={{ fontSize: "150px" }} />
                                <p className="text-xl mt-3">รายงานสรุปยอดขาย </p>

                            </div>
                        </Link>
                        <Link to="/report-customers">
                            <div className="flex flex-col items-center py-10 bg-white border duration-200 hover:bg-sky-100/50 shadow-md rounded-lg min-h-[300px]">

                                <MdOutlineGroups style={{ fontSize: "150px" }} />
                                <p className="text-xl mt-3">รายงานวิเคราะห์ลูกค้า</p>

                            </div>
                        </Link>
                        <Link to="/report-tags-customer">
                            <div className="flex flex-col items-center py-10 bg-white border duration-200 hover:bg-sky-100/50 shadow-md rounded-lg min-h-[300px]">

                                <FaUserTag style={{ fontSize: "150px" }} />
                                <p className="text-xl mt-3">รานงานวิเคราะห์ยอดขาย</p>
                                <p className="text-xl">ตามแท็กลูกค้า</p>

                            </div>
                        </Link>
                        <Link to="/report-category-sale">
                            <div className="flex flex-col items-center py-10 bg-white border duration-200 hover:bg-sky-100/50 shadow-md rounded-lg min-h-[300px]">

                                <MdOutlineStarOutline style={{ fontSize: "150px" }} />
                                
                                <p className="text-xl mt-3">รายงานพยากรณ์ยอดขาย</p>
                                <p className="text-xl">ตามหมวดหมู่</p>
                            </div>
                        </Link>
                        <Link to="/forcast-sale">
                            <div className="flex flex-col items-center py-10 bg-white border duration-200 hover:bg-sky-100/50 shadow-md rounded-lg min-h-[300px]">

                                <LiaSellsy style={{ fontSize: "150px" }} />

                                <p className="text-xl mt-3">รายงานพยากรณ์ยอดขาย</p>

                            </div>
                        </Link>


                    </div>
                </div>

            </div>
            {/* <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={handleConfirm}
                >
                    เพิ่มลูกค้าใหม่
                </Buttons>
                <Link to="/manage-customer">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div> */}
        </>

    );
}
