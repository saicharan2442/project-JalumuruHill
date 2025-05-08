import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Donor = {
  id: number;
  Name: string;
  village: string;
  district: string;
  email: string;
  phone_number: string;
  donated: string;
};

const DonorSection: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const navigate = useNavigate();

  const fetchDonors = async () => {
    try {
      const response = await fetch("http://localhost:5000/donars");
      const data: Donor[] = await response.json();

      const filtered = data
        .filter((donor) => parseInt(donor.donated, 10) >= 5000)
        .sort((a, b) => parseInt(b.donated, 10) - parseInt(a.donated, 10))
        .slice(0, 9);

      setDonors(filtered);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  useEffect(() => {
    fetchDonors();
    const interval = setInterval(fetchDonors, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-800">
          Top Donors (ప్రముఖ దాతలు)
        </h2>
        <Button
          onClick={() => navigate("/donors")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 transition-all"
        >
          See All Donors →
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {donors.map((donor) => (
          <Card
            key={donor.id}
            className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-in-out"
          >
            <CardContent className="p-5">
              <h2 className="text-xl font-bold text-yellow-700">{donor.Name}</h2>
              <p className="text-sm text-gray-700">
                {donor.village}, {donor.district}
              </p>
              <p className="text-sm text-gray-600">
                {donor.email} | {donor.phone_number}
              </p>
              <p className="text-md font-semibold text-green-700 mt-3">
                Donated: ₹{donor.donated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DonorSection;
