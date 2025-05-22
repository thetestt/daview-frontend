import { createContext, useContext, useState } from "react";

// 1. Context 생성
const SearchContext = createContext();

// 2. Provider 생성
export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchTriggered,
        setSearchTriggered,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

// 3. 훅으로 꺼내쓰도록 export
export function useSearch() {
  return useContext(SearchContext);
}
