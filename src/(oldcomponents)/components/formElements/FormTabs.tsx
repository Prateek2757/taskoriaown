import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const FormTabs = ({
  tabdata,
}: {
  tabdata: { header: string; icon: React.ReactNode; body: React.ReactNode }[];
}) => {
  return (
    <>
      <Tabs defaultValue={tabdata[0].header.toLowerCase().replace(/\s+/g, "-")} className="w-full">
        <TabsList className="grid grid-cols-5 bg-transparent h-auto p-0 rounded-lg  gap-1 my-3">
          {tabdata.map((data, index) => (
            <TabsTrigger
              key={index}
              
              value={data.header.toLowerCase().replace(/\s+/g, "-")}
              className="flex items-center rounded-lg gap-2 px-4 py-3 text-sm font-medium   border-r border-gray-300  data-[state=active]:text-white  transition-colors"
            >
              {data.icon} {data.header}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-0">
          {tabdata.map((data, index) => (
            <TabsContent
              key={index}
              value={data.header.toLowerCase().replace(/\s+/g, "-")}
              className="bg-white p-6 border border-gray-200 m-0 rounded-lg"
            >
              {data.body}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </>
  );
};

export default FormTabs;
