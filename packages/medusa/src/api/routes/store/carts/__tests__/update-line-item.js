import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

describe("POST /store/carts/:id/line-items/:line_id", () => {
  describe("successfully updates a line item", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("fr-cart")
      const lineId = IdMap.getId("existingLine")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
        {
          payload: {
            quantity: 3,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.updateLineItem).toHaveBeenCalledTimes(1)
    })

    it("calls LineItemService generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("eur-10-us-12"),
        IdMap.getId("region-france"),
        3,
        {}
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart._id).toEqual(IdMap.getId("fr-cart"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })

  describe("successfully updates a line item with metadata", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("cartLineItemMetadata")
      const lineId = IdMap.getId("lineWithMetadata")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
        {
          payload: {
            quantity: 3,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.updateLineItem).toHaveBeenCalledTimes(1)
    })

    it("calls LineItemService generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("eur-10-us-12"),
        IdMap.getId("region-france"),
        3,
        { status: "confirmed" }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart._id).toEqual(IdMap.getId("cartLineItemMetadata"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })

  describe("removes line item on quantity 0", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("fr-cart")
      const lineId = IdMap.getId("existingLine")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
        {
          payload: {
            quantity: 0,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.removeLineItem).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.removeLineItem).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("existingLine")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart._id).toEqual(IdMap.getId("fr-cart"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })
})
