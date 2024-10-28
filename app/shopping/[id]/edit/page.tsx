'use client';
import { use } from "react";

import useList from '@/hooks/shopping/useList'

export default function EditShoppingPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);

  const {
    id
  } = params;

  const list = useList(id)
  if (!list) return
  return <div>Shopping List {list.name}</div>
}
