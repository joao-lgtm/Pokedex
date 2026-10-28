import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import { DeviceProvider } from "../hooks/useDevice";
import { Device } from "../components/Device";


export function Routes(){
    return (
        <BrowserRouter>
            <DeviceProvider>
                <Device>
                    <AppRoutes/>
                </Device>
            </DeviceProvider>
        </BrowserRouter>
    )
}
