import PageTitle from "@/Components/PageTitle"
import { useStoreRoleMutation } from "@/features/apis/roleApi"
import { handleResponseError } from "@/helpers"
import useToast from "@/hooks/useToast"
import { IStoreRole } from "@/index"
import { withAuth } from "@/middlewares"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, Input } from "ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(60)
})

const Create = withAuth(() => {

  const { t } = useToast()
  const [storeRole, { isLoading }] = useStoreRoleMutation();
  const { register, setError, handleSubmit, formState: { errors } } = useForm<IStoreRole>({
    mode: "onChange",
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: IStoreRole) => {

    const response = await storeRole(data);

    if ("data" in response) {
      t([{
        state: "success",
        title: "Role created successfully"
      }])
    }

    handleResponseError(setError, response)

  }

  return (
    <>
      <PageTitle title="Create Role" description="You can create your role just from here." />
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-stone-300 overflow-hidden" >
        <div className="rounded-t-md p-3" >
          <Input error={errors.name?.message} {...register("name")} placeholder="Role Name" />
        </div>
        <div className="border-t border-stone-300 bg-stone-100 p-3" >
          <Button isLoading={isLoading} >Create Role</Button>
        </div>
      </form>
    </>
  )
})

export default Create
