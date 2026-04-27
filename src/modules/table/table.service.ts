import { ITable } from './table.interface';
import { Table } from './table.model';

const createTable = async (payload: ITable): Promise<ITable> => {
  const result = await Table.create(payload);
  return result;
};

const getAllTables = async (): Promise<ITable[]> => {
  const result = await Table.find();
  return result;
};

const getSingleTable = async (id: string): Promise<ITable | null> => {
  const result = await Table.findById(id);
  return result;
};

const updateTable = async (id: string, payload: Partial<ITable>): Promise<ITable | null> => {
  const result = await Table.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteTable = async (id: string): Promise<ITable | null> => {
  const result = await Table.findByIdAndDelete(id);
  return result;
};

export const TableService = {
  createTable,
  getAllTables,
  getSingleTable,
  updateTable,
  deleteTable,
};