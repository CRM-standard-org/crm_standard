import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

  postTag,
  updateTag,
  deleteTag,
} from "@/services/tagColor.service";
import { useToast } from "@/components/customs/alert/ToastContext";


import TagColorPicker from "@/components/customs/tagCustomer/tagColor";
//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTag } from "@/hooks/useCustomerTag";
import { TypeTagColorResponse, TypeTagAllResponse } from "@/types/response/response.tagColor";


type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeTagColorResponse; //ตรงนี้
}[];

//
export default function CustomerTag() {
  const [searchText, setSearchText] = useState("");

  //variable tag
  const [tagName, setTagName] = useState("");
  const [tagDetails, setTagDetails] = useState("");
  const [tagColor, setTagColor] = useState("#CC0033");

  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeTagColorResponse | null>(null);

  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTag, setSearchTag] = useState("");

  const { data: dataTag, refetch: refetchTag } = useTag({
    page: page,
    pageSize: pageSize,
    searchText: searchTag,
  });



  useEffect(() => {
    // console.log("Data:", dataTag);
    if (dataTag?.responseObject?.data) {
      const formattedData = dataTag.responseObject?.data.map(
        (item: TypeTagColorResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.tag_name, className: "text-left" },
            { value: item.tag_description ?? "-", className: "text-left" },
            {
              value: (
                <div
                  className="w-6 h-6 border mx-auto"
                  style={{ backgroundColor: item.color }}
                ></div>
              ),
              className: "text-center"
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataTag]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "ชื่อแท็ก", colSpan: 1, className: "min-w-20" },
    { label: "รายละเอียดแท็ก", colSpan: 1, className: "min-w-80" },
    { label: "สีแท็ก", colSpan: 1, className: "min-w-10" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];



  //handle
  const handleSearch = () => {
    setSearchTag(searchText);
    setSearchParams({ page: "1", pageSize });


  };
  useEffect(() => {
    if (searchText === "") {
      setSearchTag(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);

  //เปิด
  const handleCreateOpen = () => {
    setTagName("");
    setTagDetails("");
    setTagColor("#CC0033");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeTagColorResponse) => {
    setSelectedItem(item);
    setTagName(item.tag_name);
    setTagDetails(item.tag_description);
    setTagColor(item.color);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeTagColorResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);

  };

  //ปิด
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  //ยืนยันไดอะล็อค
  const handleConfirm = async () => {

    const errorMap: Record<string, boolean> = {};

    if (!tagName) errorMap.tagName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }

    try {
      const response = await postTag({
        tag_name: tagName, // ใช้ชื่อ field ที่ตรงกับ type
        tag_description: tagDetails,
        color: tagColor,
      });

      if (response.statusCode === 200) {
        setTagName("");
        setTagDetails("");
        setTagColor("");
        handleCreateClose();
        showToast("สร้างแท็กเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchTag();
      } else {
        showToast("แท็กนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างแท็กได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!tagName) errorMap.editTagName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }


    try {
      const response = await updateTag(selectedItem.tag_id, {
        tag_name: tagName, // ใช้ชื่อ field ที่ตรงกับ type
        tag_description: tagDetails,
        color: tagColor,
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขแท็กเรียบร้อยแล้ว", true);
        setTagName("");
        setTagDetails("");
        setTagColor("");
        setIsEditDialogOpen(false);
        refetchTag();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขแท็กได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.tag_name || !selectedItem.tag_description || !selectedItem.color) {
      showToast("กรุณาระบุแท็กที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteTag(selectedItem.tag_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการแท็กเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchTag();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Color in quotation") {
          showToast("ไม่สามารถลบรายการแท็กได้ เนื่องจากมีการใช้งานอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบรายการแท็กได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบรายการแท็กได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการแท็กได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="กลุ่มแท็ก"
        hideTitleBtn={true}
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา....",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataTag?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มแท็กใหม่"
      />
      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="เพิ่มแท็กใหม่"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">

          <InputAction
            id="tag-name"
            placeholder="ชื่อแท็ก"
            onChange={(e) => setTagName(e.target.value)}
            value={tagName}
            label="ชื่อแท็ก"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "tag-detail", down: "tag-detail" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.tagName}

          />

          <InputAction
            id="tag-detail"
            placeholder="รายละเอียดแท็ก"
            onChange={(e) => setTagDetails(e.target.value)}
            value={tagDetails}
            label="รายละเอียดแท็ก"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "tag-name", down: "tag-name" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
          />

          <TagColorPicker value={tagColor} onChange={setTagColor} />

        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขแท็ก"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="tag-name"
            placeholder="ชื่อแท็ก"
            onChange={(e) => setTagName(e.target.value)}
            value={tagName}
            label="ชื่อแท็ก"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "tag-name", down: "tag-name" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editTagName}

          />
          <InputAction
            id="tag-detail"
            placeholder="รายละเอียดแท็ก"
            onChange={(e) => setTagDetails(e.target.value)}
            value={tagDetails}
            label="รายละเอียดแท็ก"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "tag-detail", down: "tag-detail" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
          />
          <TagColorPicker value={tagColor} onChange={setTagColor} />
        </div>
      </DialogComponent>

      {/* ลบ */}
      <DialogComponent
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        title="ยืนยันการลบ"
        onConfirm={handleDeleteConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p className="font-bold text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.tag_name} </span></p>
      </DialogComponent>
    </div>
  );
}
