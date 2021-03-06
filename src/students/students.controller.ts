import { Body,
         Controller,
         Delete,
         Post,
         Get,
         Patch,
         Param,
         Query,
         HttpStatus,
         UseGuards,
         UseInterceptors,  
        } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { Schools } from 'src/schools/entities/schools.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';


@Controller('students')
@UseGuards(AuthGuard())
export class StudentsController {
    constructor(private studentsService: StudentsService){}

    @Post('/addStudent')
    createStudent(@Body() body: CreateStudentDto, school: Schools, @GetUser() user: User) {

        return this.studentsService.create(body, school, user);
    }

    @UseInterceptors(new SerializeInterceptor(StudentDto))
    @Get('/:roll_no')
    async findStudent(@Param('roll_no') roll_no: string, @GetUser() user: User) {
        const student = await this.studentsService.findOne(parseInt(roll_no),user);
        return student;
    }

    @UseInterceptors(new SerializeInterceptor(StudentDto))
    @Get()
    findAllStudents(@Query() searchQueryDto: SearchQueryDto,@GetUser() user:User) {
        return this.studentsService.find(searchQueryDto,user);
    }

    @Delete('/:roll_no')
    removeStudent(@Param('roll_no') roll_no: string, @GetUser() user: User) {
        return this.studentsService.remove(parseInt(roll_no), user);
    }

    @Patch('/:roll_no')
    updateStudent(@Param('roll_no') roll_no: string, @Body() body: UpdateStudentDto, @GetUser() user: User) {
        return this.studentsService.update(parseInt(roll_no), body,user);
    }
}
