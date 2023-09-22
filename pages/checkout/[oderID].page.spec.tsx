import { RenderResult, act, fireEvent, render } from "@testing-library/react";
import CheckoutPage from "./[orderID].page";
import { ERROR_CARD_DATA_INCORRECT, ERROR_CARD_WITHOUT_AUTHORIZATION, ERROR_CARD_WITHOUT_FUNDS, ERROR_INCORRECT_ADDRESS, ERROR_SERVER } from "dh-marvel/services/checkout/checkout.errors";

const order = {
  name: 'New X-Men (2001) #150',
  image: 'http://i.annihil.us/u/prod/marvel/i/mg/d/10/577e6cfba4e76.jpg',
  price: 10,
};

describe('Checkout Page', () => {
  const assign = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();

    Object.defineProperty(window, 'location', {
      value: { assign },
      writable: true,
    });

  });
  it('Should render personal data form and product card', () => {
    const component = render(<CheckoutPage order={order}/>);
    const nameInput = component.getByLabelText('Nombre');
    const lastnameInput = component.getByLabelText('Apellido');
    const emailInput = component.getByLabelText('Email');

    expect(component.asFragment()).toMatchSnapshot();
    expect(nameInput).toBeVisible();
    expect(lastnameInput).toBeVisible();
    expect(emailInput).toBeVisible();
  });

  it('Should render delivery data form when click next button and inputs are filled', async () => {
    const component = render(<CheckoutPage order={order}/>);
    const nameInput = component.getByLabelText('Nombre');
    const lastnameInput = component.getByLabelText('Apellido');
    const emailInput = component.getByLabelText('Email');
    const nextButton = component.getByText('Siguiente');
    const addressInput = component.getByLabelText('Dirección');

    expect(addressInput).not.toBeVisible();

    await act(() => {
      fireEvent.change(nameInput, {target: { value: 'Pepe' }});
      fireEvent.change(lastnameInput, {target: { value: 'Sapo' }});
      fireEvent.change(emailInput, {target: { value: 'myemail@hotmail.com' }});
      fireEvent.click(nextButton);
    });

    expect(addressInput).toBeVisible();
  });

  it('Should render form errors when click next button and inputs is not completed', async () => {

    const component = render(<CheckoutPage order={order}/>);
    const nameInput = component.getByLabelText('Nombre');
    const lastnameInput = component.getByLabelText('Apellido');
    const nextButton = component.getByText('Siguiente');
    const addressInput = component.getByLabelText('Dirección');
    expect(addressInput).not.toBeVisible();

    await act(() => {
      fireEvent.change(nameInput, {target: { value: 'Pepe' }});
      fireEvent.change(lastnameInput, {target: { value: 'Sapo' }});
    });

    await act(() => {
      fireEvent.click(nextButton);
    });

    expect(nameInput).toBeVisible();
    expect(addressInput).not.toBeVisible();
  });

  it('Should render personal data form when clicks on back button', async () => {
    const component = render(<CheckoutPage order={order}/>);
    const nameInput = component.getByLabelText('Nombre');
    const lastnameInput = component.getByLabelText('Apellido');
    const emailInput = component.getByLabelText('Email');
    const nextButton = component.getByText('Siguiente');
    const addressInput = component.getByLabelText('Dirección');
    const backButton = component.getByText('Anterior');
    expect(addressInput).not.toBeVisible();

    await act(() => {
      fireEvent.change(nameInput, {target: { value: 'Pepe' }});
      fireEvent.change(lastnameInput, {target: { value: 'Sapo' }});
      fireEvent.change(emailInput, {target: { value: 'myemail@hotmail.com' }});
      fireEvent.click(nextButton);
    });

    expect(addressInput).toBeVisible();

    await act(() => {
      fireEvent.click(backButton);
    });

    expect(nameInput).toBeVisible();
  });

  it('Should render payment data form when click next button and delivery data form is completed', async () => {
    const component = render(<CheckoutPage order={order}/>);
    const nameInput = component.getByLabelText('Nombre');
    const lastnameInput = component.getByLabelText('Apellido');
    const emailInput = component.getByLabelText('Email');
    const nextButton = component.getByText('Siguiente');
    const addressInput = component.getByLabelText('Dirección');
    const cityInput = component.getByLabelText('Ciudad');
    const stateInput = component.getByLabelText('Provincia');
    const zipCodeInput = component.getByLabelText('Código Postal');
    const cardNumberInput = component.getByLabelText('Número de Tarjeta');

    const backButton = component.getByText('Anterior');
    expect(addressInput).not.toBeVisible();

    await act(() => {
      fireEvent.change(nameInput, {target: { value: 'Pepe' }});
      fireEvent.change(lastnameInput, {target: { value: 'Sapo' }});
      fireEvent.change(emailInput, {target: { value: 'myemail@hotmail.com' }});
      fireEvent.click(nextButton);
    });

    await act(() => {
      fireEvent.change(addressInput, {target: { value: 'San Martin 123' }});
      fireEvent.change(cityInput, {target: { value: 'Corrientes' }});
      fireEvent.change(stateInput, {target: { value: 'Corrientes' }});
      fireEvent.change(zipCodeInput, {target: { value: '1234' }});
      fireEvent.click(nextButton);
    });

    expect(cardNumberInput).toBeVisible();
  });

  describe('handle responses', () => {
    let component: RenderResult;

    beforeEach(async () => {
      component = render(<CheckoutPage order={order}/>);
      const nameInput = component.getByLabelText('Nombre');
      const lastnameInput = component.getByLabelText('Apellido');
      const emailInput = component.getByLabelText('Email');
      const nextButton = component.getByText('Siguiente');
      const addressInput = component.getByLabelText('Dirección');
      const cityInput = component.getByLabelText('Ciudad');
      const stateInput = component.getByLabelText('Provincia');
      const zipCodeInput = component.getByLabelText('Código Postal');
      const cardNumberInput = component.getByLabelText('Número de Tarjeta');
      const cardNameInput = component.getByLabelText('Nombre en la Tarjeta');
      const expirationInput = component.getByLabelText('Fecha de Expiración');
      const codeInput = component.getByLabelText('Código de Seguridad');
      expect(addressInput).not.toBeVisible();
  
      await act(() => {
        fireEvent.change(nameInput, {target: { value: 'Pepe' }});
        fireEvent.change(lastnameInput, {target: { value: 'Sapo' }});
        fireEvent.change(emailInput, {target: { value: 'myemail@hotmail.com' }});
        fireEvent.click(nextButton);
      });
  
      await act(() => {
        fireEvent.change(addressInput, {target: { value: 'San Martin 123' }});
        fireEvent.change(cityInput, {target: { value: 'Corrientes' }});
        fireEvent.change(stateInput, {target: { value: 'Corrientes' }});
        fireEvent.change(zipCodeInput, {target: { value: '1234' }});
        fireEvent.click(nextButton);
      });

      await act(() => {
        fireEvent.change(cardNumberInput, {target: { value: '123 123 1233 1235' }});
        fireEvent.change(cardNameInput, {target: { value: 'Pepe Sapo' }});
        fireEvent.change(expirationInput, {target: { value: '12/30' }});
        fireEvent.change(codeInput, {target: { value: '12312' }});
      });
    });

    afterEach(() => {jest.clearAllMocks()});

    it('Should navigate to success page when payment is successful', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await act(() => {
        fireEvent.click(component.getByText('Enviar'));
      });
  
      expect(assign).toHaveBeenCalledWith('http://localhost:3000/checkout/success')
    });
  
    it('Should render error snackbar when card has not enough funds', async () => {
      const response = { json: () => Promise.resolve(ERROR_CARD_WITHOUT_FUNDS) };
      (global.fetch as jest.Mock).mockResolvedValue(response);

      await act(() => {
        fireEvent.click(component.getByText('Enviar'));
      });
      expect(assign).not.toHaveBeenCalledWith('http://localhost:3000/checkout/success')
      expect(component.getByText(ERROR_CARD_WITHOUT_FUNDS.message)).toBeVisible();
  
    });
  
    it('Should render error snackbar when card has not authorization',async () => {
      const response = { json: () => Promise.resolve(ERROR_CARD_WITHOUT_AUTHORIZATION) };
      (global.fetch as jest.Mock).mockResolvedValue(response);

      await act(() => {
        fireEvent.click(component.getByText('Enviar'));
      });
      expect(assign).not.toHaveBeenCalledWith('http://localhost:3000/checkout/success')
      expect(component.getByText(ERROR_CARD_WITHOUT_AUTHORIZATION.message)).toBeVisible();
    });
  
    it('Should render error snackbar when card data is invalid', async () => {
      const response = { json: () => Promise.resolve(ERROR_CARD_DATA_INCORRECT) };
      (global.fetch as jest.Mock).mockResolvedValue(response);

      await act(() => {
        fireEvent.click(component.getByText('Enviar'));
      });
      expect(assign).not.toHaveBeenCalledWith('http://localhost:3000/checkout/success')
      expect(component.getByText(ERROR_CARD_DATA_INCORRECT.message)).toBeVisible();
    });
  
    it('Should render error snackbar when delivery address is invalid',async () => {
      const response = { json: () => Promise.resolve(ERROR_INCORRECT_ADDRESS) };
      (global.fetch as jest.Mock).mockResolvedValue(response);

      await act(() => {
        fireEvent.click(component.getByText('Enviar'));
      });
      expect(assign).not.toHaveBeenCalledWith('http://localhost:3000/checkout/success')
      expect(component.getByText(ERROR_INCORRECT_ADDRESS.message)).toBeVisible();
    });
  
    it('Should render error snackbar when server throws error', async () => {
      const response = { json: () => Promise.resolve(ERROR_SERVER) };
      (global.fetch as jest.Mock).mockResolvedValue(response);

      await act(() => {
        fireEvent.click(component.getByText('Enviar'));
      });
      expect(assign).not.toHaveBeenCalledWith('http://localhost:3000/checkout/success')
      expect(component.getByText(ERROR_SERVER.message)).toBeVisible();
    });
  });

});