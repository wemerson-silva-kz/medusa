import { RouteFocusModal } from "../../../components/route-modal"
import { CreateDraftOrderForm } from "./create-draft-order-form/create-draft-order-form"

export const DraftOrderCreate = () => {
  return (
    <RouteFocusModal>
      <CreateDraftOrderForm />
    </RouteFocusModal>
  )
}
