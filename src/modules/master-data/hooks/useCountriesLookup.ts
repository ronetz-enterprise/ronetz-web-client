import { useQuery } from "@tanstack/react-query";
import { countryApi } from "../api/countryApi";

export const useCountriesLookup = () => {
  const { data: countries = [], isLoading, error } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryApi.getAll(),
  });

  return {
    countries,
    isLoading,
    error,
  };
};
