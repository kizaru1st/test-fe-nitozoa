import { Button, Label, TextInput, Alert } from "flowbite-react";
import { useEffect, useState } from "react";

function Home() {
  // Constants for API
  const API = "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json";

  // State variables
  const [inputNumber, setInputNumber] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [displayedProvinces, setDisplayedProvinces] = useState([]);
  const [error, setError] = useState("");
  const [kabkot, setKabkot] = useState([]);

  useEffect(() => {
    const fetchedProvinces = async () => {
      try {
        const response = await fetch(API);
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        setError("Failed to load provinces. Please try again later.");
      }
    };
    fetchedProvinces();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const number = parseInt(inputNumber, 10);

    if (isNaN(number) || number <= 0) {
      setDisplayedProvinces([]);
      setKabkot([]);
      setError("Number of provinces must be greater than 0");
    } else if (number > provinces.length) {
      setDisplayedProvinces([]);
      setKabkot([]);
      setError("Number of provinces must be less than the total number of provinces");
    } else {
      setError("");
      setDisplayedProvinces(provinces.slice(0, number));
    }
  };

  const handleProvinceClick = async (id) => {
    try {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`);
      const data = await response.json();
      setKabkot(data);
    } catch (error) {
      setError("Failed to load regencies. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-50 shadow-lg rounded-lg">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Select Provinces</h2>

        <div>
          <Label htmlFor="number" value="Number of Provinces" className="mb-2 block" />
          <TextInput
            id="number"
            type="number"
            required
            placeholder="Enter number of provinces"
            onChange={(e) => setInputNumber(e.target.value)}
            value={inputNumber}
          />
        </div>

        <Button type="submit" gradientDuoTone="cyanToBlue">
          Submit
        </Button>
      </form>

      {error && (
        <Alert color="failure" className="mt-4">
          <span>{error}</span>
        </Alert>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Provinces</h3>
        <ul className="space-y-2">
          {displayedProvinces.map((province) => (
            <li key={province.id}>
              <button
                onClick={() => handleProvinceClick(province.id)}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                {province.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {kabkot.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Kabupaten/Kota</h3>
          <ul className="space-y-2">
            {kabkot.map((kota) => (
              <li key={kota.id} className="text-gray-700 font-medium">
                {kota.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
