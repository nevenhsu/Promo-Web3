import axios from 'axios'
import type { Epoch, TEpoch } from '@/models/epoch'

const api = '/api/private/epoch'

export const createEpoch = async (startTime: Date, endTime: Date): Promise<TEpoch | undefined> => {
  try {
    const { data } = await axios.post<{ epoch: TEpoch }>(`${api}/create`, {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    })
    return data.epoch
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const updateEpoch = async (
  index: number,
  updateData: Partial<Epoch>
): Promise<TEpoch | undefined> => {
  try {
    const { data } = await axios.put<{ epoch: TEpoch }>(`${api}/update/${index}`, updateData)
    return data.epoch
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const deleteEpoch = async (index: number): Promise<TEpoch | undefined> => {
  try {
    const { data } = await axios.delete<{ epoch: TEpoch }>(`${api}/delete/${index}`)
    return data.epoch
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const getAllEpochs = async (): Promise<TEpoch[] | undefined> => {
  try {
    const { data } = await axios.get<{ epochs: TEpoch[] }>(api)
    return data.epochs
  } catch (err) {
    console.error(err)
    return undefined
  }
}
