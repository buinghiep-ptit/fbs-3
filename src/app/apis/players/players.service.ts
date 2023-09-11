import { http } from 'app/helpers/http-config'

export const getListPlayer = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/players', {
    params,
  })
  return data
}

export const getPositions = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/playing/position', {
    params,
  })
  return data
}

export const getTeams = async (): Promise<any> => {
  const { data } = await http.get<any>('/api/player/teams')
  return data
}

export const getPlayer = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/player/${id}`)
  return data
}

export const updatePlayer = async (params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/player`, params)
  return data
}

export const createPlayer = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/player`, params)
  return data
}
