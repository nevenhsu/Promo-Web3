import EpochModel, { type Epoch } from '@/models/epoch'
import { setMilliseconds } from 'date-fns'

export async function createEpoch(startTime: any, endTime: any) {
  try {
    const epoch = new EpochModel({
      startTime: setMilliseconds(startTime, 0),
      endTime: setMilliseconds(endTime, 0),
    })
    await epoch.save()
    console.log('Epoch created:', epoch)
    return epoch
  } catch (error) {
    console.error('Error creating epoch:', error)
    throw error
  }
}

export async function updateEpoch(index: number, updateData: Partial<Epoch>) {
  try {
    if (updateData.startTime) {
      updateData.startTime = setMilliseconds(updateData.startTime, 0)
    }
    if (updateData.endTime) {
      updateData.endTime = setMilliseconds(updateData.endTime, 0)
    }

    const updated = await EpochModel.findOneAndUpdate(
      { index },
      updateData,
      { new: true } // Options to return the updated document
    )

    if (!updated) {
      console.log('No epoch found with the index.')
      return null
    }

    console.log('Updated epoch:', updated)

    return updated
  } catch (error) {
    console.error('Error updating epoch:', error)
    throw error
  }
}

export async function deleteEpoch(index: number) {
  try {
    const deleted = await EpochModel.findOneAndDelete({ index })

    if (!deleted) {
      console.log('No epoch found with the index.')
      return null
    }

    console.log('Deleted epoch:', deleted)
    return deleted
  } catch (error) {
    console.error('Error deleting epoch:', error)
    throw error
  }
}

export async function getAllEpochs() {
  try {
    const epochs = await EpochModel.find().sort({ index: -1 })
    console.log('All epoch:', epochs.length)
    return epochs
  } catch (error) {
    console.error('Error fetching epoch:', error)
    throw error
  }
}

export async function getLastEpoch() {
  try {
    const epoch = await EpochModel.find().sort({ index: -1 }).limit(1)
    console.log('The last epoch:', epoch)
    return epoch
  } catch (error) {
    console.error('Error fetching last epoch:', error)
    throw error
  }
}

export async function getEpoch(index: number) {
  try {
    const epoch = await EpochModel.findOne({ index }).orFail()
    return epoch
  } catch (error) {
    console.error('Error fetching epoch:', error)
    return null
  }
}
