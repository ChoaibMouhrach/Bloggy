import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ITag } from "..";
import { useGetTagsQuery } from "@/features/apis/tagApi";
import { debounce } from "@/helpers";

interface TagInputProps {
  onChange?: (values: number[]) => void | Promise<void>;
  error?: string;
  help?: string;
}

function TagInput({ error, help, onChange }: TagInputProps) {
  // STATE
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [dropDownHovered, setDropDownHovered] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const inputRef = useRef<null | HTMLInputElement>(null);

  // RTK
  const {
    data: tags,
    isLoading,
    isFetching,
  } = useGetTagsQuery({
    search,
  });

  const alterTag = (newTags: ITag[]) => {
    setSelectedTags(newTags);
    if (onChange) {
      onChange(newTags.map((newTag) => newTag.id));
    }
  };

  const handleAddingTag = (tag: ITag) => {
    if (!selectedTags.find((selectedTag) => tag.id === selectedTag.id)) {
      if (inputRef.current) {
        inputRef.current.value = "";
        setSearch("");
      }
      alterTag([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: ITag) => {
    alterTag(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id));
  };

  const alterSearch = debounce((value: string) => {
    setSearch(value);
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    alterSearch(e.target.value);
  };

  return (
    <div className="bg-white py-2 border border-stone-300 rounded-md">
      <div className="px-2 flex flex-wrap gap-2">
        {selectedTags.map((selectedTag) => (
          <button
            className="text-center hover:bg-gray-100 p-2 px-4 border border-stone-300 rounded-md flex items-center gap-2"
            type="button"
            key={selectedTag.id}
            onClick={() => handleRemoveTag(selectedTag)}
          >
            {selectedTag.name}
            <MdOutlineClose />
          </button>
        ))}
        <input
          ref={inputRef}
          className="outline-none p-1 flex-1"
          onChange={handleSearch}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Tags..."
        />
      </div>
      <div className="h-[1px] relative">
        {inputFocused || dropDownHovered ? (
          <div
            onMouseEnter={() => setDropDownHovered(true)}
            onMouseLeave={() => setDropDownHovered(false)}
            className="absolute z-50 top-0 pt-4 w-full"
          >
            <ul className="border  border-stone-300 bg-white w-full p-3 rounded-md">
              {tags &&
                (tags.data.length
                  ? tags.data.map((tag) => (
                      <li key={tag.id}>
                        <button
                          onClick={() => handleAddingTag(tag)}
                          className="p-3 hover:bg-gray-50 w-full rounded-md text-start"
                          type="button"
                        >
                          {tag.name}
                        </button>
                      </li>
                    ))
                  : !isFetching && (
                      <li>
                        <div className="p-3 hover:bg-gray-50 w-full rounded-md text-start flex justify-center">
                          No results
                        </div>
                      </li>
                    ))}
              {(isLoading || isFetching) && (
                <li>
                  <div className="p-3 hover:bg-gray-50 w-full rounded-md text-start flex justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  </div>
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </div>
      {(error || help) && (
        <p
          className={`px-1 tracking-wide text-sm ${
            error ? "text-red-600" : "text-gray-500"
          }`}
        >
          {error ?? help}
        </p>
      )}
    </div>
  );
}

export default TagInput;
