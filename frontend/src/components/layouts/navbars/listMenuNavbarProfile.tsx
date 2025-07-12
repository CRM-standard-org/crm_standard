import { Flex, Text } from "@radix-ui/themes";
import { IoIosLogOut } from "react-icons/io";
import { getLogout } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

const ListMenuNavbarProfile = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    getLogout()
      .then((response) => {
        if (response.statusCode === 200) {
          navigate("/login");
        } else {
          alert(`Unexpected error: ${response.message}`);
        }
      })
      .catch((error) => {
        console.error(
          "Error creating category:",
          error.response?.data || error.message
        );
        alert("Failed to create category. Please try again.");
      });
  };
  return (
    <Flex
      className=" hover:text-blue-500 cursor-pointer"
      gap={"4"}
      align={"center"}
      onClick={handleLogout}
    >
      <IoIosLogOut size={"24px"} /> <Text>{title}</Text>
    </Flex>
  );
};

export default ListMenuNavbarProfile;
