import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

  postCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/services/customerCharacter.service";
import { useToast } from "@/components/customs/alert/ToastContext";


//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerCharacter } from "@/hooks/useCustomerCharacter";
import { TypeCharacterResponse } from "@/types/response/response.customerCharacter";


type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeCharacterResponse; //ตรงนี้
}[];

//
export default function CustomerCharacter() {
  const [searchText, setSearchText] = useState("");

  //variable tag
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");


  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeCharacterResponse | null>(null);

  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchCharacter, setSearchCharacter] = useState("");


  const { data: dataCharacter, refetch: refetchCharacter } = useCustomerCharacter({
    page: page,
    pageSize: pageSize,
    searchText: searchCharacter,
  });



  useEffect(() => {
    // console.log("Data:", dataTag);
    if (dataCharacter?.responseObject?.data) {
      const formattedData = dataCharacter.responseObject?.data.map(
        (item: TypeCharacterResponse, index: number) => ({
          className: "",
          cells: [
            { value: index + 1, className: "text-center" },
            { value: item.character_name, className: "text-left" },
            { value: item.character_description ?? "-", className: "text-center" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataCharacter]);


  //
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "min-w-10" },
    { label: "นิสัย", colSpan: 1, className: "min-w-20" },
    { label: "รายละเอียดนิสัย", colSpan: 1, className: "min-w-80" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-10" },
    { label: "ลบ", colSpan: 1, className: "min-w-10" },
  ];



  //handle
  const handleSearch = () => {
    setSearchCharacter(searchText);
    setSearchParams({ page: "1", pageSize });

  };

  useEffect(() => {
    if (searchText === "") {
      setSearchCharacter(searchText);
      setSearchParams({ page: "1", pageSize });
    }
  }, [searchText]);
  //เปิด
  const handleCreateOpen = () => {
    setCharacterName("");
    setCharacterDescription("");

    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeCharacterResponse) => {
    setSelectedItem(item);
    setCharacterName(item.character_name);
    setCharacterDescription(item.character_description);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeCharacterResponse) => {
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

    if (!characterName) errorMap.characterName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }
    try {
      const response = await postCharacter({
        character_name: characterName, // ใช้ชื่อ field ที่ตรงกับ type
        character_description: characterDescription,
      });

      if (response.statusCode === 200) {
        setCharacterName("");
        setCharacterDescription("");
        handleCreateClose();
        showToast("สร้างนิสัยเรียบร้อยแล้ว", true);
        setSearchParams({ page: "1", pageSize });
        refetchCharacter();
      } else {
        showToast("นิสัยนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างนิสัยได้", false);
    }
  };

  const handleEditConfirm = async () => {
    const errorMap: Record<string, boolean> = {};

    if (!characterName) errorMap.editCharacterName = true;


    setErrorFields(errorMap);

    if (Object.values(errorMap).some((v) => v)) {
      showToast(`กรุณากรอกข้อมูลให้ครบ`, false);
      return;
    }

    try {
      const response = await updateCharacter(selectedItem.character_id, {
        character_name: characterName, // ใช้ชื่อ field ที่ตรงกับ type
        character_description: characterDescription,
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขนิสัยเรียบร้อยแล้ว", true);
        setCharacterName("");
        setCharacterDescription("");
        setIsEditDialogOpen(false);

        refetchCharacter();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขแท็กได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.character_name || !selectedItem.character_description) {
      showToast("กรุณาระบุนิสัยที่ต้องการลบ", false);
      return;
    }


    try {
      const response = await deleteCharacter(selectedItem.character_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการนิสัยเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        setSearchParams({ page: "1", pageSize });
        refetchCharacter();
      }
      else if (response.statusCode === 400) {
        if (response.message === "Character in quotation") {
          showToast("ไม่สามารถลบรายการนิสัยได้ เนื่องจากมีการใช้งานอยู่", false);
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
        title="นิสัยลูกค้า"
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
        totalData={dataCharacter?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onCreateBtn={true}
        onCreateBtnClick={handleCreateOpen}
        nameCreateBtn="+ เพิ่มนิสัยใหม่"
      />
      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="เพิ่มนิสัยใหม่"
        onConfirm={handleConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="character-name"
            placeholder="ชื่อนิสัย"
            onChange={(e) => setCharacterName(e.target.value)}
            value={characterName}
            label="ชื่อนิสัย"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "character-detail", down: "character-detail" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.characterName}
          />

          <InputAction
            id="character-detail"
            placeholder="รายละเอียดนิสัย"
            onChange={(e) => setCharacterDescription(e.target.value)}
            value={characterDescription}
            label="รายละเอียดนิสัย"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            nextFields={{ up: "character-name", down: "character-name" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
          />


        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขนิสัย"
        onConfirm={handleEditConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmBtnType="primary"
      >
        <div className="flex flex-col space-y-5">
          <InputAction
            id="character-name"
            placeholder="ชื่อนิสัย"
            onChange={(e) => setCharacterName(e.target.value)}
            value={characterName}
            label="ชื่อนิสัย"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "character-detail", down: "character-detail" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
            require="require"
            isError={errorFields.editCharacterName}
          />
          <InputAction
            id="character-detail"
            placeholder="รายละเอียดนิสัย"
            onChange={(e) => setCharacterDescription(e.target.value)}
            value={characterDescription}
            label="รายละเอียดนิสัย"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            nextFields={{ up: "character-name", down: "character-name" }}
            classNameLabel="w-40 min-w-20 flex "
            classNameInput="w-full"
          />
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
        <p>ชื่อ : <span className="text-red-500">{selectedItem?.character_name}</span></p>
      </DialogComponent>
    </div>
  );
}
