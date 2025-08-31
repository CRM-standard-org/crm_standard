import { useCallback, useEffect, useRef, useState } from "react";
import type { OptionType } from "@/components/customs/select/select.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// ...existing code...
// import { getQuotationData } from "@/services/ms.quotation.service.ts";

import { useToast } from "@/components/customs/alert/useToast";

//
import { useNavigate, useParams, Link } from "react-router-dom";

import TextArea from "@/components/customs/textAreas/textarea.main.component";
import { PayLoadEditCompany } from "@/types/requests/request.company";
import { updateCompany } from "@/services/company.service";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DependentSelectComponent from "@/components/customs/select/select.dependent";
import { TypeAddressResponse } from "@/types/response/response.address";
import { useAddress } from "@/hooks/useAddress";
import { useResponseToOptions as responseToOptions } from "@/hooks/useOptionType";
import dayjs from "dayjs";
import DatePickerComponent from "@/components/customs/dateSelect/dateSelect.main.component";
import { useCompany } from "@/hooks/useCompany";
import { TypeCompanyResponse } from "@/types/response/response.company";
import { appConfig } from "@/configs/app.config";
import { FiImage } from "react-icons/fi";

export default function EditInfoCompany() {
  const [dataAddress, setDataAddress] = useState<TypeAddressResponse[]>();
  const { companyId } = useParams<{ companyId: string }>();
  const [dataCompany, setDataCompany] = useState<TypeCompanyResponse>();

  // use react-hook-form + zod for validation
  const schema = z.object({
    name_th: z.string().min(1, "กรุณากรอกชื่อบริษัท"),
    name_en: z.string().min(1, "กรุณากรอกชื่ออังกฤษ"),
    type: z.string().min(1, "กรุณากรอกประเภทธุรกิจ"),
    website: z.string().min(1, "กรุณากรอกเว็บไซต์"),
    founded_date: z.string().nullable().optional(),
    place_name: z.string().min(1, "กรุณากรอกชื่อสถานที่"),
    address: z.string().min(1, "กรุณากรอกที่อยู่"),
    country_id: z.string().min(1, "กรุณาเลือกประเทศ"),
    province_id: z.string().min(1, "กรุณาเลือกจังหวัด"),
    district_id: z.string().min(1, "กรุณาเลือกอำเภอ"),
    phone: z
      .string()
      .min(1, "กรุณากรอกเบอร์โทรศัพท์")
      .refine((val) => {
        // allow formatting characters but validate digits-only after stripping
        const digits = val.replace(/\D/g, "");
        return /^\d+$/.test(digits) && digits.length >= 7 && digits.length <= 12;
      }, { message: "กรุณากรอกหมายเลขโทรศัพท์เฉพาะตัวเลข (7-12 หลัก)" }),
    fax_number: z.string().optional().nullable().refine((val) => {
      if (val == null || val === "") return true;
      const digits = String(val).replace(/\D/g, "");
      return /^\d+$/.test(digits);
    }, { message: "กรุณากรอกหมายเลขโทรสารเป็นตัวเลขเท่านั้น" }),
    tax_id: z
      .string()
      .min(1, "กรุณากรอกเลขประจำตัวผู้เสียภาษี")
      .refine((val) => {
        const digits = val.replace(/\D/g, "");
        // Thai tax id is typically 13 digits; require 10-13 to be flexible
        return /^\d+$/.test(digits) && digits.length >= 10 && digits.length <= 13;
      }, { message: "กรุณากรอกเลขประจำตัวผู้เสียภาษีเป็นตัวเลข (10-13 หลัก)" }),
  });

  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);
  const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [uploadKey, setUploadKey] = useState(0);

  const { data: companyDetails, refetch: refetchCompany } = useCompany();

  const {
    control,
    handleSubmit,
    reset,
  getValues,
  watch,
    formState: { errors, isSubmitting },
  } = useForm<PayLoadEditCompany>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_th: "",
      name_en: "",
      type: "",
      website: "",
      founded_date: "",
      place_name: "",
      address: "",
      country_id: "",
      province_id: "",
      district_id: "",
      phone: "",
      fax_number: "",
      tax_id: "",
    },
  });

  // keep watch for dependent selects (not used directly here)
  const watchedCountry = watch("country_id");
  const watchedProvince = watch("province_id");

  useEffect(() => {
    if (!companyDetails?.responseObject) return;
    setDataCompany(companyDetails.responseObject);
    const c = companyDetails.responseObject;
    // map backend shape to form values
    reset({
      name_th: c.name_th ?? "",
      name_en: c.name_en ?? "",
      type: c.type ?? "",
      website: c.website ?? "",
      founded_date: c.founded_date ? String(c.founded_date) : "",
      place_name: c.place_name ?? "",
      address: c.address ?? "",
      country_id: c.country?.country_id ?? "",
      province_id: c.province?.province_id ?? "",
      district_id: c.district?.district_id ?? "",
      phone: c.phone ?? "",
      fax_number: c.fax_number ?? "",
      tax_id: c.tax_id ?? "",
    });
  }, [companyDetails, reset]);
  // removed unused mock data and headers

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

    const { options } = responseToOptions(
      dataAddress,
      "country_id",
      "country_name"
    );
    setCountryOptions(options);
  }, [dataAddress]);

  const fetchDataCountry = useCallback(async () => {
    const countryList = dataAddress ?? [];
    return {
      responseObject: countryList.map((item) => ({
        id: item.country_id,
        name: item.country_name,
      })),
    };
  }, [dataAddress]);

  useEffect(() => {
    if (!Array.isArray(dataAddress)) return setProvinceOptions([]);

    const selectedCountryId = watchedCountry || companyDetails?.responseObject?.country?.country_id || "";
    const selectedCountry = dataAddress.find((item) => item.country_id === selectedCountryId) ?? dataAddress[0];
    const provinceList = selectedCountry?.province ?? [];
    const prov = responseToOptions(provinceList, "province_id", "province_name");
    setProvinceOptions(prov.options);
  }, [dataAddress, companyDetails, watchedCountry]);

  const fetchDataProvince = useCallback(async () => {
    const selectedCountryId =
      getValues("country_id") ||
      companyDetails?.responseObject?.country?.country_id;
    const selectedCountry = dataAddress?.find(
      (item) => item.country_id === selectedCountryId
    );
    const provinceList = selectedCountry?.province ?? [];
    return {
      responseObject: provinceList.map((item) => ({
        id: item.province_id,
        name: item.province_name,
      })),
    };
  }, [dataAddress, getValues, companyDetails]);

  useEffect(() => {
    if (!Array.isArray(dataAddress)) return setDistrictOptions([]);

    const selectedCountryId = watchedCountry || companyDetails?.responseObject?.country?.country_id || "";
    const selectedProvinceId = watchedProvince || companyDetails?.responseObject?.province?.province_id || "";

    const selectedCountry = dataAddress.find((item) => item.country_id === selectedCountryId);
    const selectedProvince = selectedCountry?.province?.find((p) => p.province_id === selectedProvinceId);
    const districtList = selectedProvince?.district ?? [];
    const dist = responseToOptions(districtList, "district_id", "district_name");
    setDistrictOptions(dist.options);
  }, [dataAddress, companyDetails, watchedCountry, watchedProvince]);

  const fetchDataDistrict = useCallback(async () => {
    const selectedCountryId =
      getValues("country_id") ||
      companyDetails?.responseObject?.country?.country_id;
    const selectedProvinceId =
      getValues("province_id") ||
      companyDetails?.responseObject?.province?.province_id;
    const selectedCountry = dataAddress?.find(
      (item) => item.country_id === selectedCountryId
    );
    const selectedProvince = selectedCountry?.province?.find(
      (item) => item.province_id === selectedProvinceId
    );
    const districtList = selectedProvince?.district ?? [];
    return {
      responseObject: districtList.map((item) => ({
        id: item.district_id,
        name: item.district_name,
      })),
    };
  }, [dataAddress, getValues, companyDetails]);

  //ยืนยันไดอะล็อค
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      e.target.value = ""; // เคลียร์ input เพื่อให้เลือกไฟล์เดิมได้
    }
  };

  const onSubmit = async (values: PayLoadEditCompany) => {
    try {
      const payload: PayLoadEditCompany = {
        ...values,
        founded_date: values.founded_date
          ? dayjs(values.founded_date).format("YYYY-MM-DD")
          : "",
      };
      const response = await updateCompany(
        companyId,
        payload,
        uploadedFile
      );
      if (response?.statusCode === 200) {
        setUploadKey((prev) => prev + 1);
        refetchCompany();
        navigate("/manage-info-company");
      } else {
        showToast("ไม่สามารถแก้ไขข้อมูลบริษัทได้", false);
      }
    } catch (err) {
      showToast("ไม่สามารถแก้ไขข้อมูลบริษัทได้", false);
      console.error(err);
    }
  };

  const avatarContent = (() => {
    if (uploadedFile) {
      return (
        <img
          src={URL.createObjectURL(uploadedFile)}
          alt="preview"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    if (dataCompany?.logo) {
      return (
        <img
          src={`${appConfig.baseApi}${dataCompany.logo}`}
          alt="Company Logo"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return <FiImage size={40} />;
  })();

  return (
    <>
  {/* avatar content extracted to variable to avoid nested ternary in JSX */}
  {/**/}
      <div
        className="flex  text-2xl font-bold mb-3"
        data-upload-key={uploadKey}
      >
        <p className="me-2">จัดการข้อมูลบริษัท</p>
      </div>
      <div className="p-7 pb-5 bg-white shadow-md rounded-lg">
        <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <h1 className="text-xl font-semibold mb-1">ข้อมูลบริษัท</h1>
              <div className="border-b-2 border-main mb-6"></div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  {/* compute avatar content */}
                  {/**/}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="bg-gray-300 text-white text-center rounded-full w-40 h-40 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
                    title="คลิกเพื่อเปลี่ยนรูป"
                  >
                    {avatarContent}
                  </button>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="">
                  <Controller
                    control={control}
                    name="name_th"
                    render={({ field }) => (
                      <InputAction
                        id="company-name"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="ชื่อบริษัท"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{
                          up: "telno-extension",
                          down: "company-engname",
                        }}
                        isError={!!errors.name_th}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="name_en"
                    render={({ field }) => (
                      <InputAction
                        id="company-engname"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="ชื่ออังกฤษ"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{
                          up: "company-name",
                          down: "business-type",
                        }}
                        isError={!!errors.name_en}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <InputAction
                        id="business-type"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="ประเภทธุรกิจ"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{ up: "company-engname", down: "website" }}
                        isError={!!errors.type}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="website"
                    render={({ field }) => (
                      <InputAction
                        id="website"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="เว็บไซต์"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{ up: "business-type", down: "year" }}
                        isError={!!errors.website}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="founded_date"
                    render={({ field }) => (
                      <DatePickerComponent
                        id="year"
                        label="ปีที่ก่อตั้ง"
                        selectedDate={
                          field.value ? new Date(field.value) : null
                        }
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        required
                        nextFields={{ up: "website", down: "placename" }}
                        isError={!!errors.founded_date}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="place_name"
                    render={({ field }) => (
                      <InputAction
                        id="placename"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="ชื่อสถานที่"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{ up: "year", down: "company-address" }}
                        isError={!!errors.place_name}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <TextArea
                        id="company-address"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="ที่ตั้งสำนักงานใหญ่"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{ up: "placename", down: "country" }}
                        isError={!!errors.address}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="country_id"
                    render={({ field }) => (
                      <DependentSelectComponent
                        id="country"
                        value={
                          countryOptions.find(
                            (opt) => String(opt.value) === String(field.value)
                          ) || null
                        }
                        onChange={(option) =>
                          field.onChange(option ? String(option.value) : "")
                        }
                        fetchDataFromGetAPI={fetchDataCountry}
                        valueKey="id"
                        labelKey="name"
                        placeholder="กรุณาเลือก..."
                        isClearable
                        label="ประเทศ"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2 "
                        classNameSelect="w-full "
                        nextFields={{ up: "company-address", down: "province" }}
                        require="require"
                        isError={!!errors.country_id}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="province_id"
                    render={({ field }) => (
                      <DependentSelectComponent
                        id="province"
                        value={
                          provinceOptions.find(
                            (opt) => String(opt.value) === String(field.value)
                          ) || null
                        }
                        onChange={(option) => {
                          field.onChange(option ? String(option.value) : "");
                        }}
                        fetchDataFromGetAPI={fetchDataProvince}
                        valueKey="id"
                        labelKey="name"
                        placeholder="กรุณาเลือก..."
                        isClearable
                        label="จังหวัด"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2 "
                        classNameSelect="w-full "
                        nextFields={{ up: "country", down: "district" }}
                        require="require"
                        isError={!!errors.province_id}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="district_id"
                    render={({ field }) => (
                      <DependentSelectComponent
                        id="district"
                        value={
                          districtOptions.find(
                            (opt) => String(opt.value) === String(field.value)
                          ) || null
                        }
                        onChange={(option) =>
                        {
                            console.log(" provinceOptions:", provinceOptions)
                            console.log(" option:", option, field.value)
                            field.onChange(option ? String(option.value) : "")
                        }
                        }
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
                        nextFields={{ up: "province", down: "taxid" }}
                        isError={!!errors.district_id}
                      />
                    )}
                  />
                </div>

                <div className="">
                  <Controller
                    control={control}
                    name="tax_id"
                    render={({ field }) => (
                      <InputAction
                        id="taxid"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="เลขประจำตัวผู้เสียภาษี"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{ up: "district", down: "telno" }}
                                                isError={!!errors.tax_id}
                                                errorMessage={errors.tax_id?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold mb-1">ข้อมูลติดต่อ</h1>
              <div className="border-b-2 border-main mb-6"></div>

              <div className="space-y-3 text-gray-700">
                <div className="">
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <InputAction
                        id="telno"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="เบอร์โทรศัพท์"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                        require="require"
                        nextFields={{ up: "taxid", down: "telno-extension" }}
                          isError={!!errors.phone}
                          errorMessage={errors.phone?.message}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="fax_number"
                    render={({ field }) => (
                      <InputAction
                        id="telno-extension"
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                        label="เบอร์โทรสาร"
                        labelOrientation="horizontal"
                        classNameLabel="w-1/2"
                        classNameInput="w-full"
                          nextFields={{ up: "telno", down: "company-name" }}
                          isError={!!errors.fax_number}
                          errorMessage={errors.fax_number?.message}
                      />
                    )}
                  />
                </div>
                {/* <div className="">
                                    <InputAction
                                        id="capital-location"
                                        placeholder=""
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                        value={companyAddress}
                                        label="สำนักงานใหญ่"
                                        labelOrientation="horizontal" // vertical mobile screen
                                        classNameLabel="w-1/2"
                                        classNameInput="w-full"
                                        require="require"
                                        nextFields={{ up: "taxid", down: "company-name" }}
                                    />
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center md:justify-end space-x-5 mt-5">
        <Buttons
          btnType="primary"
          variant="outline"
          className="w-30"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          บันทึก
        </Buttons>
        <Link to="/manage-info-company">
          <Buttons btnType="cancel" variant="soft" className="w-30 ">
            ยกเลิก
          </Buttons>
        </Link>
      </div>
    </>
  );
}
