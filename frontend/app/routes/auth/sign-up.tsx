import { signUpSchema } from "@/lib/schema";
import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Dinh nghia signUpSchema
// Dùng để định nghĩa type của form data
type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
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

  const handleOnSubmit = (values: SignUpFormData) => {
    console.log(values)
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
                render={(field) => (
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
                render={(field) => (
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
                render={(field) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={(field) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign up
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