// https://reactpractice.dev/exercise/build-a-public-holidays-app/
// Build a React application that shows the national holidays for the current year, for a given country.

// The main screen should show:

// a dropdown with a list of countries
// a list of public holidays for the selected country
// You can retrieve a list of available countries and their holidays from the OpenHolidays API. Use English (en) for the languageIsoCode.
// By default, you should show the holidays for The Netherlands.


'use client'
import { useEffect, useState } from "react"

export default function HolidaysPage() {
    const [countries, setCountries] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState("NL")
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const fetchCountries = () => fetch("https://openholidaysapi.org/Countries?languageIsoCode=EN");
                const fetchHolidays = () => fetch(`https://openholidaysapi.org/PublicHolidays?countryIsoCode=${selectedCountryCode}&validFrom=2025-01-01&validTo=2025-12-31&languageIsoCode=EN`)

                const [countryResponse, holidaysResponse] = await Promise.all([fetchCountries(), fetchHolidays()])

                if (!countryResponse.ok) {
                    throw new Error("Error fetching countries data")
                }

                if (!holidaysResponse.ok) {
                    throw new Error("Error fetching holidays data")
                }

                const [countryData, holidaysData] = await Promise.all([countryResponse.json(), holidaysResponse.json()])

                setCountries(countryData)
                setHolidays(holidaysData)
                setLoading(false)

            } catch (error) {
                console.log(error)
            }
        }

        fetchCountries();

    }, [])

    const selectCountry = async (countryCode: string) => {
        setSelectedCountryCode(countryCode)
        setLoading(true)
        try {
            const response = await fetch(`https://openholidaysapi.org/PublicHolidays?countryIsoCode=${countryCode}&validFrom=2025-01-01&validTo=2025-12-31&languageIsoCode=EN`)

            if (!response.ok) {
                throw new Error("Fetch failed")
            }

            const data = await response.json();
            setHolidays(data)
            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full h-full">
            <div>
                <h1 className="font-bold text-4xl text-center pb-12">Public Holidays (by Country)</h1>
                <div className="flex gap-8">
                    <div>
                        <label className="font-bold">Select Country: </label>
                        {countries.length > 0 && <select onChange={(e) => selectCountry(e.target.value)} value={selectedCountryCode} className="border">
                            {countries.map(country => (
                                <option value={country.isoCode} key={country.isoCode}>{country.name[0].text}</option>
                            ))}
                        </select>}
                    </div>
                    <ul>
                        {!loading && holidays && holidays.map(holiday => (
                            <li key={holiday.id}>{holiday.startDate} - {holiday.name[0].text}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}