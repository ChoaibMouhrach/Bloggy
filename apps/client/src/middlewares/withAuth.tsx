import { useGetProfileQuery } from "@/features/apis/authApi"
import { getUser, setUser } from "@/features/slices/userSlice"
import { useRouter } from "next/router"
import { ComponentType, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Loading } from "ui"

export const withAuth = (CB: ComponentType) => {

  const Component = () => {

    const router = useRouter()
    const userState = useSelector(getUser)
    const dispatch = useDispatch()

    const { data: user, isError, isSuccess } = useGetProfileQuery();

    useEffect(() => {

      if (isSuccess) {
        dispatch(
          setUser({
            user,
            accessToken: localStorage.getItem("accessToken")!,
            refreshToken: localStorage.getItem("refreshToken")!
          })
        )
      }

    }, [isSuccess])

    if (isError) {
      router.push("/auth/login")
    }

    if (isSuccess && userState) {
      return <CB />
    }

    return <Loading />

  }

  return Component

}

export default withAuth
