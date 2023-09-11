import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Button, Grid, IconButton, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { editRound } from 'app/apis/leagues/leagues.service'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  fetchScheduleCup: any
}

const DialogEditRound = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const leagues = useSelector((state: any) => state.leagues)
  const [nameRound, setNameRound] = React.useState<any>('')
  const [order, setOrder] = React.useState<any>('')
  const [idRound, setIdRound] = React.useState<any>('')
  const params = useParams()
  React.useImperativeHandle(ref, () => ({
    handleClickOpen: (round: any) => {
      setNameRound(round.name)
      setOrder(round.idOrder)
      setIdRound(round.id)
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const edit = async () => {
    if (!nameRound || !order) return
    props.setIsLoading(true)
    const payload = {
      name: nameRound,
      description: null,
      idOrder: order,
      matches: [],
    }
    try {
      const res = await editRound(idRound, payload)
      if (res) {
        props.fetchScheduleCup()
        toastSuccess({
          message: 'Sửa vòng thành công',
        })
        handleClose()
      }
    } catch (e) {
      toastError({
        message: 'Sửa vòng thất bại',
      })
    } finally {
      props.setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNameRound('')
    setOrder('')
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} maxWidth="sm">
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Cập nhật vòng đấu</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Tên vòng"
                variant="outlined"
                margin="normal"
                fullWidth
                error={!nameRound}
                helperText={!nameRound ? 'Giá trị bắt buộc' : ''}
                value={nameRound}
                onChange={e => setNameRound(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Thứ tự"
                variant="outlined"
                type="number"
                error={!order}
                helperText={!order ? 'Giá trị bắt buộc' : ''}
                value={order}
                onChange={e => setOrder(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={props.isLoading}
                style={{ padding: '12px 20px' }}
                onClick={edit}
              >
                Lưu
              </Button>
              <Button
                style={{ marginLeft: '15px', padding: '12px 20px' }}
                variant="contained"
                onClick={handleClose}
              >
                Quay lại
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogEditRound
