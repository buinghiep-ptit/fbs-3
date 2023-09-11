import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { createNews } from 'app/apis/news/news.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiRHFAutocompleteWithKeyword } from 'app/components/common/MuiRHFAutocompleteWithKeyword'
import MuiRHFTextarea from 'app/components/common/MuiRHFTextarea'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { NEWS_TYPES } from 'app/constants/newsType'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import './style.css'

export interface Props {}

export default function NewsCreate(props: Props) {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isHot, setIsHot] = useState(false)
  const [showConfirmPublish, setShowConfirmPublish] = useState(false)

  const schema = yup
    .object({
      title: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      type: yup.number().required(),
      priority: yup
        .number()
        .test('required', 'Giá trị bắt buộc', value => {
          if (isHot) return value !== undefined && value !== null
          else return true
        })
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr)),
      description: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      content: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .test('notEmpty', 'Giá trị bắt buộc', value => {
          return value !== '<p></p>'
        }),
      file: yup
        .mixed()
        .required('Giá trị bắt buộc')
        .test('fileType', 'File không hợp lệ', value => {
          if (value && value.name)
            return ['png', 'jpg', 'jpeg'].includes(
              value?.name?.split('.').pop(),
            )
          else return true
        })
        .test('fileSize', 'Dung lượng file <= 50MB', value => {
          return Math.floor(value?.size / 1000000) <= 50
        }),
      keyword: yup.array().nullable(),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      type: 1,
      priority: '',
      description: '',
      content: '',
      file: null,
      keyword: [],
    },
  })
  const watchPriority = methods.watch('priority')

  const onSave = async (data: any) => {
    setIsLoading(true)
    let imgUrl: any = ''
    if (file) {
      imgUrl = await handleUploadImage(file)
    }

    const payload: any = {
      title: data.title,
      idCategory: data.type,
      type: data.type,
      priority: isHot ? data.priority : null,
      description: data.description,
      content: data.content,
      imgUrl: imgUrl,
      keyWord: data.keyword.map((k: any) => k.value).join(','),
      status: 0,
    }

    await createNews(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        navigate('/news')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
    setIsLoading(false)
  }

  const onPublish = async (data: any) => {
    setIsLoading(true)
    let imgUrl: any = ''
    if (file) {
      imgUrl = await handleUploadImage(file)
    }
    const payload: any = {
      title: data.title,
      idCategory: data.type,
      type: data.type,
      priority: data.priority,
      description: data.description,
      content: data.content,
      imgUrl: imgUrl,
      keyWord: data.keyword.map((k: any) => k.value).join(','),
      status: 1,
    }

    await createNews(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        navigate('/news')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}

      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý tin tức', path: '/news' },
            { name: 'Thêm mới tin tức', path: '/news/create' },
          ]}
        />
      </Box>

      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSave)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="title"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      error={!!methods.formState.errors?.title}
                      helperText={methods.formState.errors?.title?.message}
                      {...field}
                      label="Tiêu đề*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="type"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="demo-simple-select-label">
                        Loại tin tức*
                      </InputLabel>
                      <Select
                        fullWidth
                        {...field}
                        onChange={field.onChange as any}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Loại tin tức*"
                      >
                        {Object.values(NEWS_TYPES).map((type, index) => {
                          return (
                            <MenuItem key={index} value={type.id}>
                              {type.label}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {!!methods.formState.errors?.type?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <FormControl fullWidth margin="normal">
                  <FormControlLabel
                    label="Tin nổi bật"
                    control={
                      <Checkbox
                        checked={isHot}
                        onChange={e => {
                          setIsHot(e.target.checked)
                        }}
                      />
                    }
                  />
                  {isHot && (
                    <Controller
                      name="priority"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Chọn vị trí*
                          </InputLabel>
                          <Select
                            fullWidth
                            {...field}
                            onChange={field.onChange as any}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chọn vị trí*"
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                          </Select>
                          <FormHelperText>
                            Lưu ý: Sau khi chọn, tin tức sẽ được đưa lên đầu
                            danh sách, và thay thế vào vị trí đã chọn
                          </FormHelperText>
                          {isHot && !!watchPriority && (
                            <FormHelperText>
                              Tại 1 thời điểm chỉ có 3 tin tức nổi bật. Nếu tiếp
                              tục, tin tức này sẽ thay thế tin tức nổi bật ở vị
                              trí tương ứng
                            </FormHelperText>
                          )}
                          {!!methods.formState.errors?.priority?.message && (
                            <FormHelperText error>
                              {methods.formState.errors?.priority.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  )}
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <FormLabel error={!!methods.formState.errors?.description}>
                    Tóm tắt:*
                  </FormLabel>
                  <MuiRHFTextarea name="description" label="Tóm tắt*" />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <FormLabel error={!!methods.formState.errors?.file}>
                    Ảnh tiêu đề*:
                  </FormLabel>
                  <input
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={(event: any) => {
                      methods.setValue('file', event.target.files[0])
                      methods.trigger('file')
                      if (!!event.target.files[0]) {
                        setFile(event.target.files[0])
                        setPreviewImage(
                          window.URL.createObjectURL(event.target.files[0]),
                        )
                      }
                    }}
                  />
                  <div
                    onClick={() => {
                      const inputUploadImage = document.getElementById(
                        'uploadImage',
                      ) as HTMLInputElement | null
                      inputUploadImage?.click()
                    }}
                    style={{
                      width: '100%',
                      minHeight: '300px',
                      border: '2px dashed gray',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {!file && previewImage?.length === 0 && (
                      <div style={{ marginTop: '10px', cursor: 'pointer' }}>
                        <div>Chọn ảnh để tải lên</div>
                        <BackupIcon fontSize="large" />
                        <div>PNG/JPEG hoặc JPG</div>
                        <div>Dung lượng không quá 50mb</div>
                        <div>(Tỷ lệ ảnh phù hợp 3:2)</div>
                      </div>
                    )}
                    {previewImage?.length !== 0 && (
                      <>
                        <div style={{ textAlign: 'right' }}>
                          <IconButton
                            aria-label="delete"
                            size="large"
                            style={{ position: 'relative' }}
                            // onClick={event => {
                            //   setFile(null)
                            //   setPreviewImage('')
                            //   methods.setValue('file', null)
                            //   methods.trigger('file')
                            //   event.stopPropagation()
                            // }}
                          >
                            <img
                              src={previewImage}
                              width="100%"
                              style={{ objectFit: 'contain' }}
                            ></img>
                          </IconButton>
                        </div>
                      </>
                    )}
                  </div>
                  {!!methods.formState.errors?.file?.message && (
                    <FormHelperText error={true}>
                      {methods.formState.errors?.file.message}
                    </FormHelperText>
                  )}
                </Box>
              </Grid>
            </Grid>

            <FormControl fullWidth margin="normal">
              <FormLabel error={!!methods.formState.errors?.content}>
                Nội dung:*
              </FormLabel>
              <RHFWYSIWYGEditor name="content"></RHFWYSIWYGEditor>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <MuiRHFAutocompleteWithKeyword name="keyword" label="Từ khóa" />
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                m: 1,
              }}
            >
              <Button
                color="primary"
                type="button"
                variant="contained"
                disabled={isLoading}
                onClick={methods.handleSubmit(onSave)}
                sx={{ mr: 1 }}
              >
                Lưu
              </Button>
              <Button
                color="primary"
                type="button"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  methods.trigger().then(() => {
                    if (methods.formState.isValid) setShowConfirmPublish(true)
                  })
                }}
                sx={{ mx: 1 }}
              >
                Đăng bài
              </Button>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={() => {
                  navigate(-1)
                }}
                sx={{ mx: 1 }}
              >
                Quay lại
              </Button>
            </Box>

            <Dialog
              open={showConfirmPublish}
              onClose={() => setShowConfirmPublish(false)}
            >
              <DialogContent>Bạn có chắc muốn đăng bài?</DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setShowConfirmPublish(false)}
                  disabled={isLoading}
                >
                  Không
                </Button>
                <Button
                  onClick={methods.handleSubmit(onPublish)}
                  disabled={isLoading}
                  autoFocus
                >
                  Đồng ý
                </Button>
              </DialogActions>
            </Dialog>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
