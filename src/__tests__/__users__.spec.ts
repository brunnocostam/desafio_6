import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase"

import { AppError } from "../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUsecase: CreateUserUseCase;

describe("create a User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository);
    });
    


    it("should be able to create a user", async () => {
        const user = {
            name: "Test User",
            email: "test@example.com",
            password: "123456",
        }

        await createUserUsecase.execute({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        const createdUser = await inMemoryUsersRepository.findByEmail(user.email);



        console.log("USER IS: \n\n\n\n",createdUser);

        expect(createdUser).toHaveProperty("id");
    })

    it("should not be able to create a user if the email already exists", async () => {
        expect(async () => {
            const user = {
                name: "Test User",
                email: "test@example.com",
                password: "123456",
            }
    
            await createUserUsecase.execute({
                name: user.name,
                email: user.email,
                password: user.password,
            });

            await createUserUsecase.execute({
                name: user.name,
                email: user.email,
                password: user.password,
            });
        }).rejects.toBeInstanceOf(AppError);
    })
})