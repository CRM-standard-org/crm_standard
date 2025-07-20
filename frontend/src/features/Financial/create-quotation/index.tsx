import { useCallback, useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

import MasterSelectComponent from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import TextAreaForm from "@/components/customs/textAreas/textAreaForm";

import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";
import TextArea from "@/components/customs/textAreas/textarea.main.component";

import { TypeRoleResponse } from "@/types/response/response.customerRole";

//Character 
import { useCustomerCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";
import Rating from "@/components/customs/rating/rating.main.component";
import RadioComponent from "@/components/customs/radios/radio.component";
import { useAddress } from "@/hooks/useAddress";
import { TypeAddressResponse } from "@/types/response/response.address";
import { OptionType } from "@/components/customs/select/select.main.component";
import { useResponseToOptions } from "@/hooks/useOptionType";
import { useTeam } from "@/hooks/useTeam";
import { useTeamMember } from "@/hooks/useTeam";
import FileUploadComponent from "@/components/customs/uploadFIle/FileUploadComponent";

import { Table, Flex, Box, Text, IconButton, Select, Tabs } from "@radix-ui/themes";
import { useSelectPayment } from "@/hooks/usePayment";
import { TypePaymentmethodResponse } from "@/types/response/response.payment";
import { TypeCurrencyResponse } from "@/types/response/response.currency";
import { useSelectCurrency } from "@/hooks/useCurrency";
import { useProductById, useSelectGroupProduct, useSelectProduct, useSelectUnit } from "@/hooks/useProduct";
import { ProductByIdResponse, TypeGroupProductResponse, TypeProductResponse, TypeUnitResponse } from "@/types/response/response.product";
import MasterSelectTableComponent from "@/components/customs/select/selectTable.main.component";
import { useAllCustomer, useCustomerById, useSelectCustomerAddress, useSelectCustomerContact } from "@/hooks/useCustomer";
import { TypeAllCustomerResponse, TypeCustomerAddress, TypeCustomerContacts, TypeCustomerResponse } from "@/types/response/response.customer";
import { postQuotation } from "@/services/quotation.service";
import { PayLoadCreateQuotation } from "@/types/requests/request.quotation";
import { getProductById } from "@/services/product.service";
import { useSelectVat } from "@/hooks/useQuotation";
import { TypeVatResponse } from "@/types/response/response.quotation";
import { useSelectEmployee, useSelectResponsible } from "@/hooks/useEmployee";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";

type dateTableType = {
    className: string;
    cells: {
        value: React.ReactNode;
        className: string;
    }[];

}[];
type ProductRow = {
    id: string;
    product_id: string;
    group: string;
    groupName: string;
    unit: string;
    unitName: string;
    price: number;
    amount: number;
    discount: number;
    discountPercent: number;
    value: number;
};
//
export default function CreateQuotation() {
    const [searchText, setSearchText] = useState("");
    const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();

    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<TypeRoleResponse | null>(null);

    // variable form create quatation
    const [customer, setCustomer] = useState<string | null>(null);
    const [currency, setCurrency] = useState<string | null>(null);

    const [priority, setPriority] = useState<number>(0);
    const [issueDate, setIssueDate] = useState<Date | null>(new Date());

    const [team, setTeam] = useState<string | null>(null);
    const [teamOptions, setTeamOptions] = useState<OptionType[]>([]);
    const [responsible, setResponsible] = useState<string | null>(null);
    const [responsibleOptions, setResponsibleOptions] = useState<OptionType[]>([]);
    const [priceDate, setPriceDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());



    const [shippingMethod, setShippingMethod] = useState("บริการจัดส่ง");
    const [otherRemark, setOtherRemark] = useState("");
    const [dateDelivery, setDateDelivery] = useState<Date | null>(new Date());
    const [placeName, setPlaceName] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState<string | null>(null);
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [province, setProvince] = useState<string | null>(null);
    const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);
    const [district, setDistrict] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);
    const [customerContact, setCustomerContact] = useState<string | null>(null);
    const [customerContactOptions, setCustomerContactOptions] = useState<TypeCustomerContacts[]>([]);

    const [customerAddress, setCustomerAddress] = useState<string | null>(null);
    const [customerAddressOptions, setCustomerAddressOptions] = useState<TypeCustomerAddress[]>([]);

    const [contactPerson, setContactPerson] = useState<string>("");
    const [emailContact, setEmailContact] = useState("");
    const [telNoContact, setTelNoContact] = useState("");
    const [taxId, setTaxId] = useState("");


    //เงื่อนไขการชำระเงิน
    const [paymentCondition, setPaymentCondition] = useState<string | null>(null);
    const [installments, setInstallments] = useState<number>(1); //งวด
    const [installmentPrice, setInstallmentPrice] = useState<number[]>([]); //รายการยอดเงินของแต่ละงวด
    const [payDay, setPayDay] = useState<number>(1);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [amountAfterDiscount, setAmountAfterDiscount] = useState<number>(0);
    const [vat, setVat] = useState(0);
    const [vatId, setVatId] = useState<string | null>("");
    const [vatAmount, setVatAmount] = useState<number>(0);
    const [netTotal, setNetTotal] = useState<number>(0);

    const [paymentOption, setPaymentOption] = useState<string | null>(null);

    const [note, setNote] = useState("");
    const [remark, setRemark] = useState("");
    const [quotationRemark, setQuotationRemark] = useState("");

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [colorsName, setColorsName] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);



    const { showToast } = useToast();
    //
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

    //ดึงข้อมูล customer
    const [dataAboutCustomer, setDataAboutCustomer] = useState<TypeCustomerResponse>();


    //searchText control

    const [searchCustomerAddress, setSearchCustomerAddress] = useState("");
    const [searchCustomerContact, setSearchCustomerContact] = useState("");

    const [searchTeam, setSearchTeam] = useState("");
    const [searchProduct, setSearchProduct] = useState("");
    const [searchGroupProduct, setSearchGroupProduct] = useState("");
    const [searchUnit, setSearchUnit] = useState("");
    const [searchVat, setSearchVat] = useState("");
    const [searchPayment, setSearchPayment] = useState("");
    const [searchCurrency, setSearchCurrency] = useState("");
    const [searchEmployee, setSearchEmployee] = useState("");




    const [productRows, setProductRows] = useState<ProductRow[]>([
        { id: "", product_id: "", group: "", groupName: "", unit: "", unitName: "", price: 0, amount: 1, discount: 0, discountPercent: 0, value: 0 }
    ]);


    //fetch customer
    const { data: dataCustomer, refetch: refetchCustomer } = useAllCustomer({
        page: "1",
        pageSize: "100",
        searchText: "",
        payload: {
            tag_id: null,
            team_id: null,
            responsible_id: null,
        }
    });

    //auto fill by id customer
    const fetchDataCustomerDropdown = async () => {
        const customerList = dataCustomer?.responseObject?.data ?? [];
        return {
            responseObject: customerList.map((item: TypeAllCustomerResponse) => ({
                id: item.customer_id,
                name: item.company_name,

            })),
        }
    }

    //fetch customer detail 
    const customerId = customer ?? "";
    const { data: dataCustomerById, refetch: refetchCustomerById } = useCustomerById({ customerId });

    useEffect(() => {
        fetchDataCustomer();
    }, [dataCustomerById, dataAddress])

    const fetchDataCustomer = async () => {
        const customer = dataCustomerById?.responseObject.customer;
        if (!customer || !dataAddress) return;

        const mainAddress = customer.customer_address.find((address) => address.main_address);
        const mainContact = customer.customer_contact.find((contact) => contact.main);

        setPriority(customer.priority);
        setTaxId(customer.tax_id);
        setPlaceName(mainAddress?.place_name ?? "");
        setAddress(mainAddress?.address ?? "");
        setTeam(customer.responsible.team_employee.team_id);
        setResponsible(customer.responsible.employee_id);
        setCountry(mainAddress?.country.country_id ?? "");
        setProvince(mainAddress?.province.province_id ?? "");
        setDistrict(mainAddress?.district.district_id ?? "");
        setContactPerson(mainContact?.name ?? "");
        setEmailContact(mainContact?.email ?? "");
        setTelNoContact(mainContact?.phone ?? "");
    };


    const headers = [
        { label: "ลำดับ", colSpan: 1, className: "w-auto" },
        { label: "รายละเอียดสินค้า", colSpan: 1, className: "min-w-60" },
        { label: "กลุ่มสินค้า", colSpan: 1, className: "min-w-60" },
        { label: "หน่วย", colSpan: 1, className: "min-w-60" },
        { label: "ราคา/หน่วย", colSpan: 1, className: "min-w-20" },
        { label: "จำนวน", colSpan: 1, className: "min-w-20" },
        { label: "ส่วนลด/หน่วย", colSpan: 1, className: "min-w-10" },
        { label: "ส่วนลด(%)/หน่วย", colSpan: 1, className: "min-w-10" },
        { label: "มูลค่า", colSpan: 1, className: "min-w-20" },

    ];

    //fetch Address 
    const { data: Address } = useAddress({
        searchText: "",
    });

    useEffect(() => {
        if (Address?.responseObject) {
            setDataAddress(Address.responseObject);
        }
    }, [Address]);

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setCountryOptions([]);

        const { options } = useResponseToOptions(dataAddress, "country_id", "country_name");
        setCountryOptions(options);
    }, [dataAddress]);

    const fetchDataCountry = useCallback(async () => {
        const countryList = dataAddress ?? [];
        return {
            responseObject: countryList.map(item => ({
                id: item.country_id,
                name: item.country_name,
            })),
        };
    }, [dataAddress]);

    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setProvinceOptions([]);

        const selectedCountry = dataAddress.find(item => item.country_id === country);
        const provinceList = selectedCountry?.province ?? [];
        const { options } = useResponseToOptions(provinceList, "province_id", "province_name");
        setProvinceOptions(options);
    }, [dataAddress, country]);

    const fetchDataProvince = useCallback(async () => {
        const selectedCountry = dataAddress?.find(item => item.country_id === country);
        const provinceList = selectedCountry?.province ?? [];
        return {
            responseObject: provinceList.map(item => ({
                id: item.province_id,
                name: item.province_name,
            })),
        };
    }, [dataAddress, country]);


    useEffect(() => {
        if (!Array.isArray(dataAddress)) return setDistrictOptions([]);

        const selectedCountry = dataAddress.find(item => item.country_id === country);
        const selectedProvince = selectedCountry?.province?.find(item => item.province_id === province);
        const districtList = selectedProvince?.district ?? [];
        const { options } = useResponseToOptions(districtList, "district_id", "district_name");
        setDistrictOptions(options);
    }, [dataAddress, country, province]);

    const fetchDataDistrict = useCallback(async () => {
        const selectedCountry = dataAddress?.find(item => item.country_id === country);
        const selectedProvince = selectedCountry?.province?.find(item => item.province_id === province);
        const districtList = selectedProvince?.district ?? [];
        return {
            responseObject: districtList.map(item => ({
                id: item.district_id,
                name: item.district_name,
            })),
        };
    }, [dataAddress, country, province]);


    //fetch team 

    const { data: dataTeam, refetch: refetchTeam } = useTeam({
        page: "1",
        pageSize: "100",
        searchText: searchTeam,
    });
    useEffect(() => {
        if (dataTeam?.responseObject?.data) {
            const teamList = dataTeam.responseObject.data;
            const { options } = useResponseToOptions(teamList, "team_id", "name");
            setTeamOptions(options);
        }
    }, [dataTeam]);

    const fetchDataTeamDropdown = useCallback(async () => {
        const teamList = dataTeam?.responseObject.data ?? [];
        return {
            responseObject: teamList.map(item => ({
                id: item.team_id,
                name: item.name,
            })),
        };
    }, [dataTeam]);

    const handleTeamSearch = (searchText: string) => {
        setSearchTeam(searchText);
        refetchTeam();
    };
    //fetch Member in team 
    const { data: dataTeamMember, refetch: refetchTeamMember } = useSelectResponsible({
        team_id: team ?? "",
        searchText: searchEmployee,
    });

    useEffect(() => {
        // reset ค่าเมื่อ team เปลี่ยน
        setResponsibleOptions([]);

        if (dataTeamMember?.responseObject?.data) {
            const member = dataTeamMember.responseObject.data;
            const { options } = useResponseToOptions(
                member,
                "employee_id",
                (item) => `${item.first_name} ${item.last_name || ""}`
            );
            setResponsibleOptions(options);

        }
    }, [team, dataTeamMember]);

    const fetchDataMemberInteam = useCallback(async () => {
        const member = dataTeamMember?.responseObject?.data ?? [];
        return {
            responseObject: member.map(item => ({
                id: item.employee_id,
                name: `${item.first_name} ${item.last_name || ""}`,
            })),
        };
    }, [dataTeamMember]);

    const handleEmployeeSearch = (searchText: string) => {
        setSearchEmployee(searchText);
        refetchTeamMember();
    };

    //fetch customer contact
    const { data: dataCustomerContact, refetch: refetchCustomerContact } = useSelectCustomerContact({
        customerId,
        searchText: searchCustomerContact,
    })
    const fetchDataCustomerContactDropdown = async () => {
        const customerContactList = dataCustomerContact?.responseObject ?? [];
        setCustomerContactOptions(customerContactList);
        return {
            responseObject: customerContactList.map((item: TypeCustomerContacts) => ({
                id: item.customer_contact_id,
                name: item.name,
            })),
        }
    }
    const handleCustomerContactSearch = (searchText: string) => {
        setSearchCustomerContact(searchText);
        refetchPayment();
    };

    //fetch customer address
    const { data: dataCustomerAddress, refetch: refetchCustomerAddress } = useSelectCustomerAddress({
        customerId,
        searchText: searchCustomerAddress,
    })

    const fetchDataCustomerAddressDropdown = async () => {
        const customerAddressList = dataCustomerAddress?.responseObject ?? [];

        setCustomerAddressOptions(customerAddressList);

        return {
            responseObject: customerAddressList.map((item: TypeCustomerAddress) => ({
                id: item.address_id,
                name: item.place_name,
            })),
        };
    };

    const handleCustomerAddressSearch = (searchText: string) => {
        setSearchCustomerAddress(searchText);
        refetchPayment();
    };

    //fetch Payment Method
    const { data: dataPayment, refetch: refetchPayment } = useSelectPayment({
        searchText: searchPayment,
    })
    const fetchDataPaymentDropdown = async () => {
        const paymentMethodList = dataPayment?.responseObject?.data ?? [];
        return {
            responseObject: paymentMethodList.map((item: TypePaymentmethodResponse) => ({
                id: item.payment_method_id,
                name: item.payment_method_name,
            })),
        }
    }
    const handlePaymentSearch = (searchText: string) => {
        setSearchPayment(searchText);
        refetchPayment();
    };

    //fetch Currency
    const { data: dataCurrency, refetch: refetchCurrency } = useSelectCurrency({
        searchText: searchCurrency,
    })
    const fetchDataCurrencyDropdown = async () => {
        const currencyList = dataCurrency?.responseObject?.data ?? [];
        return {
            responseObject: currencyList.map((item: TypeCurrencyResponse) => ({
                id: item.currency_id,
                name: item.currency_name,
            })),
        }
    }
    const handleCurrencySearch = (searchText: string) => {
        setSearchCurrency(searchText);
        refetchCurrency();
    };
    //fetch vat
    const { data: dataVat, refetch: refetchVat } = useSelectVat({
        searchText: searchVat
    })
    const fetchDataVatDropdown = async () => {
        const vatList = dataVat?.responseObject.data ?? [];
        return {
            responseObject: vatList.map((Item: TypeVatResponse) => ({
                id: Item.vat_id,
                name: Item.vat_percentage,
            }))
        }
    }
    const handleVatSearch = (searchText: string) => {
        setSearchVat(searchText);
        refetchUnit;
    }
    //เงื่อนไขการชำระเงิน
    const fetchPaymentCondition = async () => {
        return {
            responseObject: [
                { id: 1, name: "เต็มจำนวน" },
                { id: 2, name: "แบ่งชำระ" },
            ],
        };
    };
    //fetch Group Product
    const { data: dataGroupProduct, refetch: refetchGroupProduct, } = useSelectGroupProduct({
        searchText: searchGroupProduct,
    })
    const fetchDataGroupProductDropdown = async () => {
        const groupProductList = dataGroupProduct?.responseObject?.data ?? [];
        return {
            responseObject: groupProductList.map((item: TypeGroupProductResponse) => ({
                id: item.group_product_id,
                name: item.group_product_name,
            })),
        }
    }
    const handleGroupProductSearch = (searchText: string) => {
        setSearchProduct(searchText);
        refetchGroupProduct();
    };

    //fetch Unit
    const { data: dataUnit, refetch: refetchUnit } = useSelectUnit({
        searchText: searchUnit
    })
    const fetchDataUnitDropdown = async () => {
        const unitList = dataUnit?.responseObject.data ?? [];
        return {
            responseObject: unitList.map((Item: TypeUnitResponse) => ({
                id: Item.unit_id,
                name: Item.unit_name,
            }))
        }
    }
    const handleUnitSearch = (searchText: string) => {
        setSearchUnit(searchText);
        refetchUnit;
    }
    //fetch Product 
    const { data: dataProduct, refetch: refetchProduct } = useSelectProduct({
        searchText: searchProduct,
    })
    const fetchDataProductDropdown = async () => {
        const productList = dataProduct?.responseObject?.data ?? [];
        return {
            responseObject: productList.map((item: TypeProductResponse) => ({
                id: item.product_id,
                name: item.product_name,
            })),
        }
    }
    const handleProductSearch = (searchText: string) => {
        setSearchProduct(searchText);
        refetchProduct();
    };
    //fetch product by Id
    const fetchProductById = async (productId: string): Promise<TypeProductResponse | null> => {
        try {
            const res: ProductByIdResponse = await getProductById(productId);
            return res.responseObject ?? null;
        } catch (err) {
            console.error("Error fetching product:", err);
            return null;
        }
    };
    // calculate zone
    const calculateQuotationCosts = (totalAmount: number, discount: number, vatPercent: number) => {
        const amountAfterDiscount = totalAmount - discount;
        const vatAmount = amountAfterDiscount * vatPercent / 100;
        const netTotal = amountAfterDiscount + vatAmount;

        return {
            amountAfterDiscount: Number(amountAfterDiscount.toFixed(2)),
            vatAmount: Number(vatAmount.toFixed(2)),
            netTotal: Number(netTotal.toFixed(2)),
        };
    };
    // re render if depen change
    useEffect(() => {
        const { amountAfterDiscount, vatAmount, netTotal } = calculateQuotationCosts(
            totalAmount,
            Number(discount),
            Number(vat)
        );

        setAmountAfterDiscount(amountAfterDiscount);
        setVatAmount(vatAmount);
        setNetTotal(netTotal);
    }, [totalAmount, discount, vat]);

    //สำหรับคำนวณตัวงวด 
    const generateInstallments = (count: number, total: number) => {
        //แบ่งให้เท่าๆกัน
        const evenValue = Math.floor(total / count);
        const remain = total % count;

        const values = [];
        for (let i = 0; i < count; i++) {
            values.push(i === count - 1 ? evenValue + remain : evenValue);
        }
        return values;
    };

    useEffect(() => {
        if (paymentCondition === "แบ่งชำระ" && installments > 0) {
            const newInstallments = generateInstallments(installments, netTotal);
            setInstallmentPrice(newInstallments);
        }
    }, [installments, paymentCondition, netTotal]);


    const handleNavCreate = () => {
        navigate('/create-customer');
    }
    //เปิด
    const handleApproveOpen = () => {
        // setRoleName("");
        // setRoleDescription("");
        setIsApproveDialogOpen(true);
    };
    //ปิด
    const handleApproveClose = () => {
        // setRoleName("");
        // setRoleDescription("");
        setIsApproveDialogOpen(false);
    };
    //ยืนยัน Create quotation
    const handleConfirm = () => createQuotation("ระหว่างดำเนินการ");
    const handleConfirmApprove = () => createQuotation("รออนุมัติ");

    const createQuotation = async (quotationStatus: string) => {

        const payment_term_day = paymentCondition === "เต็มจำนวน" ? payDay : undefined;
        const payment_term_installment = paymentCondition === "แบ่งชำระ" ? installments : undefined;
        const payment_term = paymentCondition === "เต็มจำนวน"
            ? [{ installment_no: 1, installment_price: netTotal }]
            : installmentPrice.map((price, index) => ({
                installment_no: index + 1,
                installment_price: price,
            }));


        const errorMap: Record<string, boolean> = {};

        if (!customer) errorMap.customer = true;
        if (!issueDate) errorMap.issueDate = true;
        if (!team) errorMap.team = true;
        if (!responsible || responsibleOptions.length === 0) { errorMap.responsible = true; }
        if (!priceDate) errorMap.priceDate = true;
        if (!taxId) errorMap.taxId = true;
        if (!endDate) errorMap.endDate = true;
        if (!dateDelivery) errorMap.dateDelivery = true;
        if (!placeName) errorMap.placeName = true;
        if (!address) errorMap.address = true;
        if (!country) errorMap.country = true;
        if (!province || provinceOptions.length === 0) { errorMap.province = true; }
        if (!district || districtOptions.length === 0) { errorMap.district = true; }
        if (!contactPerson) errorMap.contactPerson = true;
        if (!emailContact) errorMap.emailContact = true;
        if (!telNoContact) errorMap.telNoContact = true;
        if (!currency) errorMap.currency = true;
        if (!discount == null) errorMap.discount = true;
        if (!vatId) errorMap.vatId = true;
        if (!payDay || payDay == 0) errorMap.payDay = true;
        if (!paymentCondition) errorMap.paymentCondition = true;
        if (!paymentOption) errorMap.paymentOption = true;

        setErrorFields(errorMap);
        if (Object.values(errorMap).some((v) => v)) {
            showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
            return;
        }
        const missingFields: string[] = [];
        if (!priority) missingFields.push("ความสำคัญ");
        if (!shippingMethod) missingFields.push("การรับสินค้า");

        if (missingFields.length > 0) {
            showToast(`กรุณากรอกข้อมูลให้ครบ: ${missingFields.join(" , ")}`, false);
            return;
        }

        const items = productRows
            .filter((row) => row.product_id && row.unit && row.price > 0 && row.amount > 0)
            .map((row) => ({
                product_id: row.product_id,
                quotation_item_count: Number(row.amount),
                unit_id: row.unit,
                unit_price: Number(row.price),
                unit_discount: Number(row.discount),
                unit_discount_percent: Number(row.discountPercent),
                quotation_item_price: Number(row.value),
                group_product_id: row.group,
            }));



        if (!items || items.length === 0) {
            showToast("กรุณากรอกสินค้าอย่างน้อย 1 รายการให้ครบถ้วน", false);
            return;
        }
        const payload: PayLoadCreateQuotation = {
            customer_id: customer ?? "",
            priority,
            issue_date: issueDate ? dayjs(issueDate).format("YYYY-MM-DD") : "",
            team_id: team ?? "",
            responsible_employee: responsible ?? "",
            price_date: priceDate ? dayjs(priceDate).format("YYYY-MM-DD") : "",
            shipping_method: shippingMethod,
            shipping_remark: otherRemark,
            expected_delivery_date: dateDelivery ? dayjs(dateDelivery).format("YYYY-MM-DD") : "",
            place_name: placeName,
            address: address,
            country_id: country!,
            province_id: province!,
            district_id: district!,
            contact_name: contactPerson,
            contact_email: emailContact,
            contact_phone: telNoContact,
            items,
            currency_id: currency ?? "",
            total_amount: totalAmount,
            special_discount: Number(discount),
            amount_after_discount: amountAfterDiscount,
            vat_id: vatId ?? "",
            vat_amount: vatAmount,
            grand_total: netTotal,
            additional_notes: note ?? "",
            payment_term_name: paymentCondition ?? "",
            payment_method_id: paymentOption ?? "",
            remark: remark ?? "",
            expected_closing_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
            payment_term: payment_term,
            ...(payment_term_day !== undefined && { payment_term_day }),
            ...(payment_term_installment !== undefined && { payment_term_installment }),
            quotation_status: quotationStatus,
            quotation_status_remark: quotationRemark ?? "",
        };

        console.log("ส่ง payload", payload);
        console.log("ไฟล์แนบ:", uploadedFiles);
        try {
            const response = await postQuotation(payload, uploadedFiles);
            if (response.statusCode === 200) {
                showToast("สร้างใบเสนอราคาเรียบร้อยแล้ว", true);
                navigate("/quotation");
            } else {
                showToast("ไม่สามารถสร้างใบเสนอราคาได้", false);
            }

        } catch (err) {
            showToast("ไม่สามารถสร้างใบเสนอราคาได้", false);
            console.error(err);
        }
    };

    useEffect(() => {
        console.log("province option", provinceOptions)
        console.log("province", province)
    }, [provinceOptions, province, country])
    //handle

    const handleAddProduct = () => {
        setProductRows([...productRows, {
            id: "", product_id: "", group: "", groupName: "", unit: "", unitName: "", price: 0, amount: 1, discount: 0, discountPercent: 0, value: 0
        }]);
    };
    const handleRemoveProduct = (index: number) => {
        const newRows = [...productRows];
        newRows.splice(index, 1);
        setProductRows(newRows);

        // คำนวณราคารวมใหม่
        const total = newRows.reduce((sum, r) => sum + r.value, 0);
        setTotalAmount(total);
    };

    const handleChange = async (index: number, field: keyof ProductRow, value: string | number) => {
        const updatedRows = [...productRows];


        const numberFields: (keyof ProductRow)[] = ["price", "amount", "discount", "discountPercent", "value"];

        if (numberFields.includes(field)) {
            const numericValue = typeof value === "string" ? parseFloat(value) : value;
            (updatedRows[index] as any)[field] = isNaN(numericValue) ? 0 : numericValue; //ถ้าเผลอใส่ string มา จะแปลงเป็น 0 ทันที
        } else {
            (updatedRows[index] as any)[field] = value;
        }

        if (field === "product_id" && typeof value === "string") {
            const product = await fetchProductById(value);
            if (product) {
                updatedRows[index].unit = product.unit?.unit_id ?? "";
                updatedRows[index].unitName = product.unit?.unit_name ?? "";
                updatedRows[index].group = product.group_product?.group_product_id ?? "";
                updatedRows[index].groupName = product.group_product?.group_product_name ?? "";
                updatedRows[index].price = product.unit_price ?? 0;
            }
        }

        // cal value
        const row = updatedRows[index];
        const calculatedValue = (row.price - row.discount) * row.amount;
        updatedRows[index].value = isNaN(calculatedValue) ? 0 : parseFloat(calculatedValue.toFixed(2));

        // cal totalAmount
        const total = updatedRows.reduce((sum, r) => sum + r.value, 0);

        setProductRows(updatedRows);
        setTotalAmount(total);
    };


    return (
        <>
            <h1 className="text-2xl font-bold mb-3">สร้างใบเสนอราคา</h1>

            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mb-5 ">
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    {/* รายละเอียดเอกสาร */}
                    <h1 className="text-xl font-semibold mb-1">รายละเอียดเอกสาร</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">
                            <MasterSelectComponent
                                id="customer"
                                onChange={(option) => setCustomer(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataCustomerDropdown}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ลูกค้า"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "customer-contact", down: "team" }}
                                require="require"
                                isError={errorFields.customer}

                            />
                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="team"
                                value={teamOptions.find((opt) => opt.value === team) || null}
                                onChange={(option) => setTeam(option ? String(option.value) : null)}
                                onInputChange={handleTeamSearch}
                                fetchDataFromGetAPI={fetchDataTeamDropdown}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ทีม"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "customer", down: "responsible" }}
                                require="require"
                                isError={errorFields.team}

                            />

                        </div>
                        <div className="flex flex-row justify-between space-x-4 pb-2 pt-2">
                            <label className="whitespace-nowrap">ความสำคัญ<span style={{ color: "red" }}>*</span></label>
                            <Rating value={priority} onChange={setPriority} />
                        </div>
                        <div className="">

                            <DependentSelectComponent
                                id="responsible"
                                value={responsibleOptions.find((opt) => opt.value === responsible) || null}
                                onChange={(option) => {
                                    const selectedId = option ? String(option.value) : null;
                                    setResponsible(selectedId);
                                }}
                                onInputChange={handleEmployeeSearch}
                                fetchDataFromGetAPI={fetchDataMemberInteam}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ผู้รับผิดชอบ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "team", down: "issue-date" }}
                                require="require"
                                isError={errorFields.responsible}

                            />
                        </div>
                        <div className="">
                            <DatePickerComponent
                                id="issue-date"
                                label="วันออกเอกสาร"
                                placeholder="dd/mm/yy"
                                selectedDate={issueDate}
                                onChange={(date) => setIssueDate(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "responsible", down: "price-date" }}
                                useTodayAsDefault={false}
                                required
                                isError={errorFields.issueDate}

                            />
                        </div>
                        <div className="">
                            <DatePickerComponent
                                id="price-date"
                                label="วันยื่นราคา"
                                placeholder="dd/mm/yy"
                                selectedDate={priceDate}
                                onChange={(date) => setPriceDate(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "issue-date", down: "identify" }}
                                required
                                isError={errorFields.priceDate}

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="identify"
                                placeholder=""
                                onChange={(e) => setTaxId(e.target.value)}
                                value={taxId}
                                label="เลขผู้เสียภาษี"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "price-date", down: "end-date" }}
                                require="require"
                                isError={errorFields.taxId}

                            />

                        </div>
                        <div className="">
                            <DatePickerComponent
                                id="end-date"
                                label="วันที่คาดว่าจะปิดดีล"
                                placeholder="dd/mm/yy"
                                selectedDate={endDate}
                                onChange={(date) => setEndDate(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "identify", down: `${shippingMethod ? "shipping-other" : "country"}` }}
                                required
                                isError={errorFields.endDate}

                            />
                        </div>

                    </div>




                    {/* รายละเอียดการจัดส่ง */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดการจัดส่ง</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="flex flex-col sm:flex-row justify-between ">
                            <h1>การรับสินค้า <span style={{ color: "red" }}>*</span></h1>
                            <RadioComponent
                                options={[
                                    { label: "บริการจัดส่ง", value: "บริการจัดส่ง" },
                                    { label: "รับด้วยตนเอง", value: "รับด้วยตนเอง" },
                                    { label: "ไม่ระบุ", value: "ไม่ระบุ" },
                                    { label: "อื่นๆ", value: "อื่นๆ" },
                                ]}
                                value={shippingMethod}
                                onChange={setShippingMethod}

                            />
                        </div>
                        {shippingMethod && shippingMethod === "อื่นๆ" && (
                            <InputAction
                                id="shipping-other"
                                placeholder="โปรดระบุ"
                                onChange={(e) => setOtherRemark(e.target.value)}
                                value={otherRemark}
                                label="อื่นๆ โปรดระบุ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "end-date", down: "country" }}
                                require="require"

                            />
                        )}

                        <div className="">
                            <DependentSelectComponent
                                id="country"
                                value={countryOptions.find((opt) => opt.value === country) || null}
                                onChange={(option) => setCountry(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataCountry}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="ประเทศ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "end-date", down: "date-delivery" }}
                                require="require"
                                isError={errorFields.country}

                            />
                        </div>

                        <div className="">

                            <DatePickerComponent
                                id="date-delivery"
                                label="วันจัดส่งสินค้า"
                                selectedDate={dateDelivery}
                                onChange={(date) => setDateDelivery(date)}
                                classNameLabel="w-1/2"
                                classNameInput="w-full"
                                nextFields={{ up: "country", down: "province" }}
                                required
                                isError={errorFields.dateDelivery}

                            />
                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="province"
                                value={provinceOptions.find((opt) => opt.value === province) || null}
                                onChange={(option) => setProvince(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataProvince}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="จังหวัด"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                nextFields={{ up: "date-delivery", down: "placename" }}
                                require="require"
                                isError={errorFields.province}

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="placename"
                                placeholder=""
                                onChange={(e) => setPlaceName(e.target.value)}
                                value={placeName}
                                label="ชื่อสถานที่"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "province", down: "district" }}
                                isError={errorFields.placeName}

                            />
                        </div>
                        <div className="">
                            <DependentSelectComponent
                                id="district"
                                value={districtOptions.find((opt) => opt.value === district) || null}
                                onChange={(option) => setDistrict(option ? String(option.value) : null)}
                                fetchDataFromGetAPI={fetchDataDistrict}
                                valueKey="id"
                                labelKey="name"
                                placeholder="กรุณาเลือก..."
                                isClearable
                                label="อำเภอ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 "
                                classNameSelect="w-full "
                                require="require"
                                nextFields={{ up: "placename", down: "address" }}
                                isError={errorFields.district}

                            />
                        </div>

                        <div className="space-x-4">

                            <TextArea
                                id="address"
                                placeholder=""
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                label="ที่อยู่"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "district", down: "customer-address" }}
                                isError={errorFields.address}

                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="customer-address"
                                onChange={(option) => {
                                    const selectedId = option ? String(option.value) : null;
                                    setCustomerAddress(selectedId);

                                    if (selectedId) {
                                        const selected = customerAddressOptions.find(item => item.address_id === selectedId);
                                        if (selected) {
                                            setPlaceName(selected.place_name)
                                            setAddress(selected.address)
                                            setCountry(selected.country.country_id)
                                            setProvince(selected.province.province_id)
                                            setDistrict(selected.district.district_id)
                                        }
                                    }
                                }}
                                fetchDataFromGetAPI={fetchDataCustomerAddressDropdown}
                                onInputChange={handleCustomerAddressSearch}
                                valueKey="id"
                                labelKey="name"
                                label="ที่อยู่หลักของลูกค้า"
                                placeholder="กรุณาเลือก..."
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "address", down: "contact-person" }}

                            />
                        </div>


                    </div>

                    {/* รายละเอียดผู้ติดต่อ */}
                    <h1 className="text-xl font-semibold mt-4 mb-1">รายละเอียดผู้ติดต่อ</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        <div className="">
                            <InputAction
                                id="contact-person"
                                placeholder=""
                                onChange={(e) => setContactPerson(e.target.value)}
                                value={contactPerson}
                                label="ชื่อผู้ติดต่อ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                require="require"
                                nextFields={{ up: "customer-address", down: "telno-contact" }}
                                isError={errorFields.contactPerson}

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="telno-contact"
                                placeholder=""
                                onChange={(e) => setTelNoContact(e.target.value)}
                                value={telNoContact}
                                label="เบอร์ผู้ติดต่อ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "contact-person", down: "email-contact" }}
                                require="require"
                                maxLength={10}
                                isError={errorFields.telNoContact}

                            />
                        </div>
                        <div className="">

                            <InputAction
                                id="email-contact"
                                placeholder=""
                                onChange={(e) => setEmailContact(e.target.value)}
                                value={emailContact}
                                label="อีเมลผู้ติดต่อ"
                                labelOrientation="horizontal"
                                classNameLabel="w-1/2 flex "
                                classNameInput="w-full"
                                nextFields={{ up: "telno-contact", down: "customer-contact" }}
                                require="require"
                                isError={errorFields.emailContact}

                            />
                        </div>
                        <div className="">
                            <MasterSelectComponent
                                id="customer-contact"
                                onChange={(option) => {
                                    const selectedId = option ? String(option.value) : null;
                                    setCustomerContact(selectedId);

                                    if (selectedId) {
                                        const selected = customerContactOptions.find(item => item.customer_contact_id === selectedId);
                                        if (selected) {
                                            setContactPerson(selected.name)
                                            setEmailContact(selected.email)
                                            setTelNoContact(selected.phone)
                                        }
                                    }
                                }}
                                fetchDataFromGetAPI={fetchDataCustomerContactDropdown}
                                onInputChange={handleCustomerContactSearch}
                                valueKey="id"
                                labelKey="name"
                                label="ผู้ติดต่อหลักของลูกค้า"
                                placeholder="กรุณาเลือก..."
                                classNameLabel="w-1/2 flex"
                                classNameSelect="w-full "
                                nextFields={{ up: "email-contact", down: "customer" }}
                            />
                        </div>
                    </div>


                </div>
            </div>

            {/* Table */}
            <Box
                className={` mt-4 bg-white border-0 rounded-md relative p-6 shadow-lg`}
            >

                <div className={`w-full overflow-x-auto`}>
                    <Table.Root className="w-full bg-white rounded-md">
                        <Table.Header className="sticky top-0 z-0">
                            <Table.Row className="text-center bg-main text-white sticky top-0 z-10 whitespace-nowrap">
                                {headers.map((header, index) => (
                                    <Table.ColumnHeaderCell
                                        key={index}
                                        colSpan={header.colSpan}
                                        className={`${index === 0 ? "rounded-tl-md" : ""}
                                    ${index === headers.length - 1 ? "rounded-tr-md" : ""}
                                    h-7 ${header.className || ""}`}
                                    >
                                        {header.label}
                                    </Table.ColumnHeaderCell>
                                ))}

                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {productRows.length > 0 ? (
                                productRows.map((row, index) => (
                                    <Table.Row key={index}>

                                        <Table.Cell className="p-0 h-[35px] border border-gray-300 text-center align-middle">
                                            {index + 1}
                                        </Table.Cell>

                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">
                                            <MasterSelectTableComponent
                                                id="product_id"
                                                onChange={(option) =>
                                                    handleChange(index, "product_id", option ? String(option.value) : "")
                                                }
                                                fetchDataFromGetAPI={fetchDataProductDropdown}
                                                onInputChange={handleProductSearch}
                                                valueKey="id"
                                                labelKey="name"
                                                placeholder=""
                                                classNameLabel="w-1/2"
                                                classNameSelect="w-full h-full border-none shadow-none focus:ring-0 rounded-none"
                                            />

                                        </Table.Cell>

                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">
                                            <MasterSelectTableComponent
                                                id="group"
                                                onChange={(option) => handleChange(index, 'group', option ? String(option.value) : "")}
                                                fetchDataFromGetAPI={fetchDataGroupProductDropdown}
                                                onInputChange={handleGroupProductSearch}
                                                valueKey="id"
                                                labelKey="name"
                                                placeholder=""
                                                isClearable
                                                label=""
                                                labelOrientation="horizontal"
                                                classNameLabel="w-1/2"
                                                classNameSelect="w-full h-full border-none shadow-none focus:ring-0 rounded-none"
                                                defaultValue={{ label: row.groupName, value: row.group }}

                                            />
                                        </Table.Cell>

                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">

                                            <MasterSelectTableComponent
                                                id="unit"
                                                onChange={(option) => handleChange(index, 'unit', option ? String(option.value) : "")}
                                                fetchDataFromGetAPI={fetchDataUnitDropdown}
                                                onInputChange={handleUnitSearch}
                                                valueKey="id"
                                                labelKey="name"
                                                placeholder=""
                                                isClearable
                                                labelOrientation="horizontal"
                                                classNameLabel="w-1/2"
                                                classNameSelect="w-full h-full border-none shadow-none focus:ring-0"
                                                defaultValue={{ label: row.unitName, value: row.unit }}

                                            />

                                        </Table.Cell>

                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">
                                            <InputAction
                                                type="number"
                                                placeholder=""
                                                value={row.price.toString()}
                                                onChange={(e) => handleChange(index, "price", parseFloat(e.target.value))}
                                                classNameInput="w-full h-full border-none shadow-none focus-within:bg-sky-100 rounded-none"
                                            />
                                        </Table.Cell>

                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">
                                            <InputAction
                                                type="number"
                                                placeholder=""
                                                value={row.amount.toString()}
                                                onChange={(e) => handleChange(index, 'amount', parseFloat(e.target.value))}
                                                classNameInput="w-full h-full border-none shadow-none focus-within:bg-sky-100 rounded-none"
                                            />

                                        </Table.Cell>




                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">
                                            <InputAction
                                                type="number"
                                                placeholder=""
                                                value={row.discount.toString()}
                                                onChange={(e) => handleChange(index, 'discount', parseFloat(e.target.value))}
                                                classNameInput="w-full h-full border-none shadow-none focus-within:bg-sky-100 rounded-none"
                                            />
                                        </Table.Cell>

                                        <Table.Cell className="p-0  h-[35px] border border-gray-300">
                                            <InputAction
                                                type="number"
                                                placeholder=""
                                                value={row.discountPercent.toString()}
                                                onChange={(e) => handleChange(index, 'discountPercent', parseFloat(e.target.value))}
                                                classNameInput="w-full h-full border-none shadow-none focus-within:bg-sky-100 rounded-none"
                                            />
                                        </Table.Cell>

                                        <Table.Cell className="p-0 h-[35px] border border-gray-300">
                                            <InputAction
                                                type="number"
                                                placeholder=""
                                                value={row.value.toFixed(2)}
                                                onChange={(e) => handleChange(index, 'value', parseFloat(e.target.value))}
                                                classNameInput="w-full h-full border-none shadow-none focus-within:bg-sky-100 rounded-none"
                                                disabled={true}
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="ms-2 rounded-lg p-2 h-[35px] border border-blue-300  text-center flex items-center justify-center gap-2">                                            <IconButton
                                            variant="ghost"
                                            aria-label="Delete Row"
                                            onClick={() => {
                                                if (productRows.length > 1) handleRemoveProduct(index);
                                                else showToast("ต้องมีสินค้าอย่างน้อย 1 รายการ", false);
                                            }}
                                        >
                                            <RiDeleteBin6Line style={{ color: "red", fontSize: "18px" }} />
                                        </IconButton>
                                        </Table.Cell>




                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={headers.length + 2}
                                        className="text-center h-64 align-middle border border-gray-300"
                                    >
                                        No Data Found
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>

                    </Table.Root>

                </div >
                <div className="flex space-x-3 mt-3">

                    <Buttons
                        btnType="primary"
                        variant="outline"
                        className="w-30"
                        onClick={handleAddProduct}
                    >
                        + เพิ่มสินค้า
                    </Buttons>

                    <MasterSelectComponent
                        onChange={(option) => setCurrency(option ? String(option.value) : null)}
                        fetchDataFromGetAPI={fetchDataCurrencyDropdown}
                        onInputChange={handleCurrencySearch}
                        valueKey="id"
                        labelKey="name"
                        placeholder="สกุลเงิน"
                        isClearable
                        label=""
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2 flex"
                        classNameSelect="w-full "
                        nextFields={{ left: "email", right: "email", up: "responsible", down: "doc-release-date" }}
                        isError={errorFields.currency}

                    />

                </div>
            </Box>
            {/* รายละเอียดการชำระเงิน */}
            <div className="p-7 pb-5 bg-white shadow-lg rounded-lg mt-7" >
                <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
                    <h1 className="text-xl font-semibold mb-1">รายละเอียดการชำระเงิน</h1>
                    <div className="border-b-2 border-main mb-6"></div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* ฝั่งซ้าย */}
                        <div className="space-y-3">

                            <div className="flex justify-between space-x-4">
                                <label>ราคารวม</label>
                                <label>{totalAmount.toFixed(2)}</label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <div className="flex flex-row">

                                    <InputAction
                                        id="position"
                                        placeholder=""
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        value={discount.toString()}
                                        label="ส่วนลดพิเศษ"
                                        labelOrientation="horizontal"
                                        onAction={handleConfirm}
                                        classNameLabel="xl:w-25 flex"
                                        classNameInput="xl:w-20 sm:ms-3"
                                        require="require"
                                        isError={errorFields.discount}

                                    />
                                </div>
                                <label>{amountAfterDiscount.toFixed(2)}</label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <div className="flex flex-row">
                                    <MasterSelectComponent
                                        onChange={(option) => {

                                            setVat(option ? Number(option.label.replace("%", "")) : 0);
                                            setVatId(option ? String(option.value) : null);
                                        }}
                                        fetchDataFromGetAPI={fetchDataVatDropdown}
                                        onInputChange={handleVatSearch}
                                        valueKey="id"
                                        labelKey="name"
                                        label="VAT (%)"
                                        placeholder="vat"
                                        isClearable
                                        className="xl:w-25 flex"
                                        classNameSelect="sm:ms-10"
                                        require="require"
                                        isError={errorFields.vatId}

                                    />

                                </div>
                                <label>{vatAmount.toFixed(2)}</label>
                            </div>


                            <div className="border-b-2 border-main mb-6"></div>

                            <div className="flex justify-between space-x-4">
                                <label>ยอดรวมทั้งหมด</label>
                                <label>{netTotal.toFixed(2)}</label>
                            </div>

                            <div className="border-b-2 border-main mb-6"></div>

                            <div className="space-x-4">

                                <TextArea
                                    id="note"
                                    placeholder=""
                                    onChange={(e) => setNote(e.target.value)}
                                    value={note}
                                    label="บันทึกเพิ่มเติม"
                                    labelOrientation="horizontal"
                                    onAction={handleConfirm}
                                    classNameLabel="w-1/2  "
                                    classNameInput="w-full"
                                    onMicrophone={true}
                                    nextFields={{ left: "company-district", right: "company-district", up: "company-value", down: "country" }}

                                />
                            </div>
                        </div>

                        {/* ฝั่งขวา */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="xl:me-15 whitespace-nowrap">เงื่อนไขการชำระเงิน<span style={{ color: "red" }}>*</span></label>
                                <div className="flex flex-row items-center space-x-3 sm:ms-16">

                                    <MasterSelectComponent
                                        id="payment-condition"
                                        onChange={(option) => {
                                            setPaymentCondition(option ? String(option.name) : null);
                                            setPayDay(1);
                                            setInstallments(1);
                                            setInstallmentPrice([netTotal]);
                                        }}
                                        fetchDataFromGetAPI={fetchPaymentCondition}
                                        valueKey="id"
                                        labelKey="name"
                                        placeholder="เลือกเงื่อนไข"
                                        isClearable
                                        classNameSelect="w-48"
                                        isError={errorFields.paymentCondition}

                                    />

                                    {/* เงื่อนไข */}
                                    {paymentCondition === "เต็มจำนวน" && (
                                        <>
                                            <label>ภายใน<span style={{ color: "red" }}>*</span></label>
                                            <InputAction

                                                id="payDay"
                                                type="number"
                                                value={payDay.toString()}
                                                onChange={(e) => setPayDay(Number(e.target.value))}
                                                classNameInput="w-24"
                                                isError={errorFields.payDay}

                                            />
                                            <label>วัน</label>
                                        </>
                                    )}

                                    {paymentCondition === "แบ่งชำระ" && (
                                        <>
                                            <label>ภายใน<span style={{ color: "red" }}>*</span></label>
                                            <InputAction
                                                id="installments"
                                                type="number"
                                                value={installments.toString()}
                                                onChange={(e) => {
                                                    const count = Number(e.target.value);
                                                    if (!isNaN(count) && count > 0) {
                                                        setInstallments(count); // useEffect จะจัดการ render งวดให้
                                                    }
                                                }}
                                                classNameInput="w-24 text-end"
                                                isError={errorFields.installments}

                                            />
                                            <label>งวด</label>
                                        </>
                                    )}
                                </div>

                            </div>

                            {/* จำนวนงวด */}
                            {
                                paymentCondition === "แบ่งชำระ" && (
                                    <div className="mt-4 border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
                                        <h3 className="text-base font-semibold text-gray-700 mb-3">รายละเอียดงวดการชำระเงิน<span style={{ color: "red" }}>*</span></h3>

                                        {installmentPrice.length > 0 && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-4">
                                                    {installmentPrice.map((value, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <label className="text-sm font-semibold whitespace-nowrap text-gray-600">
                                                                งวด {index + 1}
                                                            </label>
                                                            <InputAction
                                                                type="number"
                                                                value={value.toFixed(2).toString()}
                                                                onChange={(e) => {
                                                                    const updated = [...installmentPrice];
                                                                    updated[index] = Number(e.target.value);
                                                                    setInstallmentPrice(updated);
                                                                }}
                                                                classNameInput="w-24 text-end"
                                                            />
                                                            <label className="text-sm text-gray-600 whitespace-nowrap">บาท</label>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* ตรวจสอบยอดรวม*/}
                                                {(() => {
                                                    const totalInstallments = installmentPrice.reduce((sum, value) => sum + value, 0);
                                                    const diff = totalInstallments - netTotal;

                                                    if (Math.abs(diff) < 0.01) return null;

                                                    return (
                                                        <div className="text-red-500 text-sm mt-3">
                                                            ยอดรวมของทุกงวด {diff > 0 ? `มากกว่า` : `น้อยกว่า`} ยอดรวมทั้งหมด {Math.abs(diff).toFixed(2)} บาท
                                                            {/* (ยอดงวดรวม: {totalInstallments.toFixed(2)} บาท / ยอดรวมทั้งหมด: {netTotal.toFixed(2)} บาท) */}
                                                        </div>
                                                    );
                                                })()}
                                            </>
                                        )}
                                    </div>
                                )
                            }

                            <div className="">
                                <MasterSelectComponent
                                    id="payment-option"
                                    onChange={(option) => setPaymentOption(option ? String(option.value) : null)}
                                    fetchDataFromGetAPI={fetchDataPaymentDropdown}
                                    onInputChange={handlePaymentSearch}
                                    valueKey="id"
                                    labelKey="name"
                                    placeholder="กรุณาเลือก..."
                                    isClearable
                                    label="วิธีการชำระเงิน"
                                    labelOrientation="horizontal"
                                    classNameLabel="w-1/2 flex"
                                    classNameSelect="w-full "
                                    require="require"
                                    isError={errorFields.paymentOption}

                                />

                            </div>



                            <div className="space-x-4">

                                <TextArea
                                    id="remark"
                                    placeholder=""
                                    onChange={(e) => setRemark(e.target.value)}
                                    value={remark}
                                    label="หมายเหตุ"
                                    labelOrientation="horizontal"
                                    onAction={handleConfirm}
                                    classNameLabel="w-1/2 flex "
                                    classNameInput="w-full"

                                />
                            </div>
                            <div className="space-x-4">

                                <FileUploadComponent
                                    label="แนบเอกสารที่เกี่ยวข้อง"
                                    labelFile="แนบเอกสาร"
                                    onFilesChange={(files) => setUploadedFiles(files)}
                                    classNameLabel="w-1/3 flex"
                                    classNameInput="w-full"
                                />
                            </div>


                        </div>
                    </div>
                </div>
            </div >
            <div className="flex justify-center md:justify-end space-x-5 mt-5">
                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={handleConfirm}
                >
                    สร้างเอกสาร
                </Buttons>

                <Buttons
                    btnType="primary"
                    variant="outline"
                    className="w-30"
                    onClick={() => handleApproveOpen()}
                >
                    สร้างเอกสารและส่งคำขออนุมัติ
                </Buttons>
                <Link to="/quotation">
                    <Buttons
                        btnType="cancel"
                        variant="soft"
                        className="w-30 "
                    >
                        ยกเลิก
                    </Buttons>
                </Link>

            </div>
            {/* ส่งคำขออนุมัติ */}
            <DialogComponent
                isOpen={isApproveDialogOpen}
                onClose={handleApproveClose}
                title="เพิ่มหมายเหตุ การส่งคำขออนุมัติ"
                onConfirm={handleConfirmApprove}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                confirmBtnType="primary"
            >
                <div className="flex flex-col space-y-5">

                    <TextArea
                        id="quotationRemark"
                        placeholder=""
                        onChange={(e) => setQuotationRemark(e.target.value)}
                        value={quotationRemark}
                        label="หมายเหตุ"
                        labelOrientation="horizontal"
                        onAction={handleConfirmApprove}
                        classNameLabel="w-40 min-w-20 flex "
                        classNameInput="w-full"
                    />

                </div>
            </DialogComponent>
        </>

    );
}
