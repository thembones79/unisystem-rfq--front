interface IspPath {
  department: string;
  kam_folder: string;
}

export const spPath = ({ department, kam_folder }: IspPath) => {
  const domain = "https://unisystem3.sharepoint.com/sites/";
  if (department === "EX") {
    return `${domain}/SalesEX/Shared Documents/Projects`;
  } else if (department === "PL") {
    return `${domain}/Customers-${kam_folder}/Shared Documents`;
  } else {
    throw new Error(`Department ${department} does not exist!`);
  }
};
