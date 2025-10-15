import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, DollarSign, RefreshCw, FileText } from "lucide-react";

import AgentInfo from "./Components/AgentInfo/AgentInfo";
import SelfBusiness from "./Components/SelfBusiness/SelfBusiness";
import EarnedCommission from "./Components/EarnedCommission/EarnedCommission";
import FPIPendingPolicy from "./Components/FPIPendingPolicy/FPIPendingPolicy";

const AgentInfoTabs = () => {
  const tabsData = [
    {
      id: "agent-info",
      label: "Agent Information",
      icon: <User className="w-4 h-4 mr-2" />,
      component: <AgentInfo />,
    },
    {
      id: "self-business",
      label: "Self Business",
      icon: <Building2 className="w-4 h-4 mr-2" />,
      component: <SelfBusiness />,
    },
    {
      id: "earned-commission",
      label: "Earned Commission",
      icon: <DollarSign className="w-4 h-4 mr-2" />,
      component: <EarnedCommission />,
    },
    {
      id: "renewal-pending-policy",
      label: "Renewal Pending Policy",
      icon: <RefreshCw className="w-4 h-4 mr-2" />,
      component: (
        <h3 className="text-lg font-semibold mb-4">Renewal Pending Policy</h3>
      ),
    },
    {
      id: "fpi-pending-policy",
      label: "FPI Pending Policy",
      icon: <FileText className="w-4 h-4 mr-2" />,
      component: <FPIPendingPolicy />,
    },
  ];

  return (
    <div className="py-2">
      <Tabs defaultValue={tabsData[0].id}>
        <TabsList>
          {tabsData.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsData.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <div className="bg-white  rounded-lg">{tab.component}</div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AgentInfoTabs;
