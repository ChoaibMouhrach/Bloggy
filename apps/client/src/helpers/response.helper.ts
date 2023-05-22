import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { IResponseError } from "..";

// handles http response errors
export const handleResponseError = <T extends FieldValues>(setError: UseFormSetError<T>, response: { data: any } | { error: SerializedError | FetchBaseQueryError }) => {
  if ("error" in response) {
    const { data } = response.error as { data: IResponseError<keyof T> }
    if (typeof data.message === "string") {
      setError("root", {
        message: data.message
      })
    } else {
      for (let error of data.message) {
        setError(error.path[0], {
          message: error.message
        })
      }
    }
  }
}
