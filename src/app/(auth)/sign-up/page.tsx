import { Card } from "@/components/ui/card";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import React from "react";

type Props = {};

const SignUpPage = (props: Props) => {
  console.log('SignUpPage rendered');

  return (
    <SignUpView />
  );
};

export default SignUpPage;
