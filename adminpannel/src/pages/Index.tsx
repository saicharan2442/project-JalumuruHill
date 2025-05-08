import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Contact,
  Users,
  Image,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Index = () => {
  const [counts, setCounts] = useState({
    temples: 0,
    events: 0,
    donors: 0,
    contacts: 0,
    ebooks: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templesRes, eventsRes, donorsRes, contactsRes, ebooksRes] = await Promise.all([
          fetch("http://localhost:5000/api/temples"),
          fetch("http://localhost:5000/api/events"),
          fetch("http://localhost:5000/api/donors"),
          fetch("http://localhost:5000/api/contacts"),
          fetch("http://localhost:5000/api/ebooks"),
        ]);

        const [temples, events, donors, contacts, ebooks] = await Promise.all([
          templesRes.json(),
          eventsRes.json(),
          donorsRes.json(),
          contactsRes.json(),
          ebooksRes.json(),
        ]);

        setCounts({
          temples: temples?.total || temples.length || 0,
          events: events?.total || events.length || 0,
          donors: donors?.total || donors.length || 0,
          contacts: contacts?.total || contacts.length || 0,
          ebooks: ebooks?.total || ebooks.length || 0,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const sectionData = [
    { name: "Temples", count: counts.temples, icon: <Image size={28} />, to: "/temples" },
    { name: "Donors", count: counts.donors, icon: <Users size={28} />, to: "/donors" },
    { name: "Events", count: counts.events, icon: <Calendar size={28} />, to: "/events" },
    { name: "Contacts", count: counts.contacts, icon: <Contact size={28} />, to: "/contacts" },
    { name: "Ebooks", count: counts.ebooks, icon: <BookOpen size={28} />, to: "/ebooks" },
  ];

  const colors = ["#5A67D8", "#48BB78", "#ED8936", "#D53F8C", "#38B2AC"];

  const chartData = sectionData.map(({ name, count }) => ({
    name,
    value: count,
  }));

  return (
    <MainLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-10">
        <h1 className="text-3xl font-bold text-temple-800 dark:text-temple-100">Dashboard</h1>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {sectionData.map(({ name, count, icon, to }, index) => (
            <Link key={name} to={to}>
              <Card className="transition-shadow duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-temple-800 dark:text-temple-100">{name}</CardTitle>
                    <div className={`p-2 rounded-full`} style={{ backgroundColor: colors[index], color: "#fff" }}>
                      {icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-temple-900 dark:text-temple-100 mb-1">
                    {count}
                  </div>
                  <p className="text-sm text-muted-foreground">{`Total ${name.toLowerCase()}`}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-temple-800 dark:text-temple-100">Summary Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#5A67D8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-temple-800 dark:text-temple-100">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
