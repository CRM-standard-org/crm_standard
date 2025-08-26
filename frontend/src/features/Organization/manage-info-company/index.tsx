import { useEffect, useState } from "react";
import { IconButton } from "@radix-ui/themes";
import { LuPencil } from "react-icons/lu";
import Buttons from "@/components/customs/button/button.main.component";
import { Link, useNavigate } from "react-router-dom";
import { LabelWithValue } from "@/components/ui/label";
import { useCompany } from "@/hooks/useCompany";
import { TypeCompanyResponse } from "@/types/response/response.company";
import { appConfig } from "@/configs/app.config";
export default function ManageInfoCompany() {
  const [dataCompany, setDataCompany] = useState<TypeCompanyResponse>();
  const navigate = useNavigate();
  const {
    data: companyDetails,
    refetch: refetchCompany,
    isLoading: companyLoading,
    isError: companyError,
  } = useCompany();
  useEffect(() => {
    if (companyDetails?.responseObject) {
      setDataCompany(companyDetails.responseObject);
    }
  }, [companyDetails]);

  const logoUrl = dataCompany?.logo
    ? `${appConfig.baseApi}${dataCompany.logo}`
    : null;

  return (
    <>
      <div className="flex  text-2xl font-bold mb-3 justify-between">
        <p className="me-2">จัดการข้อมูลบริษัท</p>
        <Link to={`/edit-info-company/${dataCompany?.company_id}`}>
          <Buttons btnType="primary" variant="outline" className="w-30 ">
            <LuPencil style={{ fontSize: "18px" }} />
            แก้ไข
          </Buttons>
        </Link>
      </div>
      <div className="p-7 pb-5 bg-white shadow-lg rounded-lg">
        <div className="w-full max-w-full overflow-x-auto lg:overflow-x-visible">
          {companyLoading && (
            <div className="py-6">กำลังโหลดข้อมูลบริษัท...</div>
          )}
          {companyError && (
            <div className="py-6 text-red-600">
              เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <h1 className="text-xl font-semibold mb-1">ข้อมูลบริษัท</h1>
              <div className="border-b-2 border-main mb-6"></div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  {dataCompany?.logo ? (
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      className="w-40 h-40 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 text-white text-center rounded-full w-40 h-40 flex items-center justify-center">
                      Logo
                    </div>
                  )}
                </div>

                <LabelWithValue
                  label="ชื่อบริษัท"
                  value={`${dataCompany?.name_th || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="ชื่ออังกฤษ"
                  value={`${dataCompany?.name_en || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="ประเภทธุรกิจ"
                  value={`${dataCompany?.type || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="เว็บไซต์"
                  value={`${dataCompany?.website || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="ปีที่ก่อตั้ง"
                  value={
                    dataCompany?.founded_date
                      ? new Date(dataCompany.founded_date).toLocaleDateString(
                          "th-TH"
                        )
                      : "-"
                  }
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="ชื่อสถานที่"
                  value={`${dataCompany?.place_name || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="ที่ตั้งสำนักงานใหญ่"
                  value={`${dataCompany?.address || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="ประเทศ"
                  value={`${dataCompany?.country?.country_name || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="จังหวัด"
                  value={`${dataCompany?.province?.province_name || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="อำเภอ"
                  value={`${dataCompany?.district?.district_name || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />

                <LabelWithValue
                  label="เลขประจำตัวผู้เสียภาษี"
                  value={`${dataCompany?.tax_id || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold mb-1">ข้อมูลติดต่อ</h1>
              <div className="border-b-2 border-main mb-6"></div>
              <div className="space-y-3 text-gray-700">
                <LabelWithValue
                  label="เบอร์โทรศัพท์"
                  value={`${dataCompany?.phone || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                <LabelWithValue
                  label="เบอร์โทรสาร"
                  value={`${dataCompany?.fax_number || "-"}`}
                  classNameLabel="sm:w-1/2"
                  classNameValue="w-full"
                />
                {/* <LabelWithValue label="สำนักงานใหญ่" value="ช่องทางการติดต่อที่ 1" classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="" value="ช่องทางการติดต่อที่ 2" classNameLabel="sm:w-1/2" classNameValue="w-full" />
                                <LabelWithValue label="" value="ช่องทางการติดต่อที่ 3" classNameLabel="sm:w-1/2" classNameValue="w-full" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
