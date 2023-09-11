import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useChangePassword } from 'app/hooks/useAuth'
import { messages } from 'app/utils/messages'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type FormData = {
  currentPassword?: string
  newPassword?: string
  passwordConfirmation?: string
}

export default function ChangePassword({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(messages.MSG1),
    newPassword: Yup.string()
      .required(messages.MSG1)
      .test('latinChars', messages.MSG21, value => {
        const regexStr = /^[\x20-\x7E]+$/
        if (value) {
          return regexStr.test(value)
        } else return false
      })
      .matches(/^\S*$/, messages.MSG21)
      .matches(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,32}$/g, messages.MSG20),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], messages.MSG11)
      .required(messages.MSG1),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const onSuccess = (data: any) => {
    toastSuccess({ message: messages.MSG23 })
    navigate(-1)
  }
  const onError = (error: any) => {
    if (error.data && error.data.error === 'PASSWORD_INCORRECT')
      methods.setError('currentPassword', {
        message: 'Mật khẩu không chính xác',
      })
  }

  const { mutate: changePassword, isLoading } = useChangePassword(
    onSuccess,
    onError,
  )

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const handleClickShowPassword = () => {
    setShowPassword(prev => ({
      ...prev,
      visibility: !prev.visibility,
    }))
  }

  const getContent = () => {
    return (
      <Box
        sx={{
          paddingLeft: {
            xs: '6.66%',
            sm: '13.33%',
          },
          paddingRight: {
            xs: '6.66%',
            sm: '13.33%',
          },
        }}
      >
        <FormProvider {...methods}>
          <Stack gap={3} py={3}>
            <FormInputText
              type={showPassword.visibility ? 'text' : 'password'}
              name="currentPassword"
              label={'Mật khẩu cũ'}
              placeholder="Nhập mật khẩu cũ"
              iconEnd={
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {!showPassword.visibility ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              }
              defaultValue=""
            />
            <FormInputText
              type={showPassword.visibility ? 'text' : 'password'}
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              label={'Mật khẩu mới'}
              iconEnd={
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {!showPassword.visibility ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              }
              defaultValue=""
            />

            <FormInputText
              type={showPassword.visibility ? 'text' : 'password'}
              name="passwordConfirmation"
              placeholder="Nhập lại mật khẩu mới"
              label={'Xác nhận mật khẩu mới'}
              iconEnd={
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {!showPassword.visibility ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              }
              defaultValue=""
            />
          </Stack>

          {isLoading && <LinearProgress />}
        </FormProvider>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={isLoading}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
