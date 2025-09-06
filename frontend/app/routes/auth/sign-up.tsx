import { signUpSchema } from "@/lib/schema";
import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useSignUpMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

// Dinh nghia signUpSchema
// Dùng để định nghĩa type của form data
export type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
  const navigate = useNavigate();

  //Thì form sẽ chứa tất cả các hàm và thuộc tính mà bạn thường destructure như:
  //const { register, handleSubmit, formState, reset, setValue, getValues, control, watch, trigger } = form;
  //zodResolver(schema) liên kết Zod schema với React Hook Form.
  const form  = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: ""
    }
  })

  /*
  const {
    mutate,          // Hàm trigger mutation (callback style, không cần await)
    mutateAsync,     // Hàm trigger mutation (promise style, có thể await)
    data,            // Data trả về từ mutationFn khi thành công
    error,           // Error object nếu mutation thất bại
    isIdle,          // true khi mutation chưa chạy
    isLoading,       // true khi mutation đang chạy
    isSuccess,       // true khi mutation thành công
    isError,         // true khi mutation thất bại
    status,          // "idle" | "loading" | "success" | "error"
    reset            // Hàm reset state về idle
  } = useMutation({ mutationFn });

  useMutation la ham chua useSignUpMutation  nen:
    - mutate la 
 */
  const {mutate, isPending} = useSignUpMutation();

  const handleOnSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Email Verification Required", {
          description:
            "Pleasee check your email for a verification link. If you don't see it, please check your spam folder."
        });
        
        form.reset();
        navigate("/sign-in")

      },
      onError: (error: any) => {
        const errorMesaage = error.response?.data?.message || "An error occurred";
        console.log(error);
        toast.error(errorMesaage);
      }
    })
  }


  // Khi bạn không thể dùng trực tiếp register() vì component đó:
  // Không phải là <input>, <select>, <textarea> HTML gốc
  // Không hỗ trợ ref
  // Không hoạt động với {...register("field")}
  // Bạn sẽ dùng Controller và truyền control vào.

  // Flow hoạt động:
  // Bạn gọi useForm() → có control
  // Truyền control và name vào FormField
  // FormField → gọi Controller
  // Controller quản lý state: value, onChange, error, v.v.
  // render → bạn dùng các props đó để hiển thị UI <Input>, <Select>,...

  //   field là một object chứa các props cần thiết để kết nối input vào hệ thống form:
  // {
  //   name: "email",                // tên field
  //   value: "abc@example.com",     // giá trị hiện tại
  //   onChange: fn,                 // gọi khi input thay đổi
  //   onBlur: fn,                   // gọi khi blur
  //   ref: ref                      // để React Hook Form có thể focus / validate
  // }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel> Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>

          <CardFooter className="flex items-center justify-center mt-6">
            <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/sign-in">Sign in</Link>
                </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp