import { useQuery } from "@tanstack/react-query";
import { countryApi } from "../../core/api/endpoints/countryApi";

export const useCountries = () => {
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
