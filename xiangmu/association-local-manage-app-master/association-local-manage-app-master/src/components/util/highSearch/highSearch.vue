<template>
  <div class="flex flexwrap">
    <template v-for="(item,index) in searchList">
      <div class="searchBox" :key="item.key" v-if="item.type===1">
        <el-input
          :class="[item.width]"
          v-model="searchList[index].value"
          size="small"
          :placeholder="'搜索'+item.title"
          clearable
        >
          <div slot="prefix"></div>
        </el-input>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
      <div class="searchBox" v-else-if="item.type===2" :key="item.key">
        <el-date-picker
          prefix-icon="1"
          :class="[item.width]"
          v-model="searchList[index].value"
          :placeholder="item.title"
          :value-format="item.timeType"
          size="small"
          :type="item.time"
        ></el-date-picker>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul v-if="item.specialType">
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.specialType]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
            <ul v-else>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
      <div class="searchBox" v-else-if="item.type==3&&item.key==='sex'" :key="item.key">
        <el-select v-model="searchList[index].value" size="small" :class="[item.width]"
                   :placeholder="`请选择${item.title}`" clearable>
          <div slot="prefix"></div>
          <template v-for="(sex,index) in ['男','女']">
            <el-option :key="'sex'+index" :label="sex" :value="sex"></el-option>
          </template>
        </el-select>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
      <div class="searchBox" v-else-if="item.type==3&&item.key==='currentCollegeId'" :key="item.key">
        <el-select v-model="searchList[index].value" size="small" :class="[item.width]"
                   :placeholder="`请选择${item.title}`" clearable>
          <div slot="prefix"></div>
          <template v-for="college in collegeList">
            <el-option :key="college.id" :label="college.name" :value="college.id"></el-option>
          </template>
        </el-select>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
      <div class="searchBox" v-else-if="item.type==3&&item.key==='education'" :key="item.key">
        <el-select v-model="searchList[index].value" size="small" :class="[item.width]"
                   :placeholder="`请选择${item.title}`" clearable>
          <div slot="prefix"></div>
          <template v-for="education in educationList">
            <el-option :key="education.key" :label="education.title" :value="education.title"></el-option>
          </template>
        </el-select>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
      <div class="searchBox" v-else-if="item.type==3&&item.key==='birthday'" :key="item.key">
        <el-select v-model="birthdayType" size="small" placeholder="生日格式" style="width: 120px;" clearable>
          <div slot="prefix"></div>
          <el-option
            v-for="birth of birthdayTypeList" :key="'birth'+birth.key"
            :label="birth.title"
            :value="birth.key"
          ></el-option>
        </el-select>
        <el-date-picker
          v-if="birthdayType===1"
          style="margin-left: -14px;width: 160px"
          size="small"
          v-model="searchList[index].value"
          clearable
          :placeholder="`请选择${item.title}`"
          format="yyyy年"
          type="year"
          value-format="yyyy"
        >
        </el-date-picker>
        <el-select
          v-if="birthdayType===2"
          style="margin-left: -14px;width: 160px"
          size="small"
          v-model="searchList[index].value"
          clearable
          :placeholder="`请选择${item.title}`"
        >
          <el-option :value="month.value" :label="month.label" v-for="month of birthOptions"
                     :key="'month'+month.value"></el-option>
        </el-select>
        <el-select
          v-if="birthdayType===3"
          style="margin-left: -14px;width: 160px"
          size="small"
          v-model="searchList[index].value"
          clearable
          :placeholder="`请选择${item.title}`"
        >
          <el-option :value="day.value" :label="day.label" v-for="day of birthOptions[0].children"
                     :key="'month'+day.value"></el-option>
        </el-select>
        <el-date-picker
          v-if="birthdayType===4"
          style="margin-left: -14px;width: 160px"
          size="small"
          v-model="searchList[index].value"
          clearable
          :placeholder="`请选择${item.title}`"
          format="yyyy年MM月"
          value-format="yyyy-MM"
          type="month"
        >
        </el-date-picker>
        <el-cascader
          v-if="birthdayType===5"
          style="margin-left: -14px;width: 160px"
          size="small"
          v-model="searchList[index].value"
          separator=""
          :placeholder="`请选择${item.title}`"
          :options="birthOptions"
          class="el-input"
        />
        <el-date-picker
          v-if="birthdayType===6"
          style="margin-left: -14px;width: 160px"
          size="small"
          v-model="searchList[index].value"
          clearable
          :placeholder="`请选择${item.title}`"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          type="date"
        >
        </el-date-picker>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
      <div class="searchBox" v-else-if="item.type==3&&item.key==='currentCity'" :key="item.key">
        <city-choose :class="[item.width]" :placeholder="`请选择${item.title}`"
                     class="el-input el-input--prefix el-input--suffix" show-city size="small" checkStrictly
                     v-model="searchList[index].value"/>
        <el-popover :ref="item.key" placement="bottom" width="150" class="searchSelectBox" trigger="click">
          <i slot="reference" :class="[searchConList[item.condition].key,'iconfont','serachInput']"></i>
          <vue-scroll style="height:150px;">
            <ul>
              <li
                @click="selectSearchCon(item,searchItem)"
                :class="{'searchConItem':true,'ifSlect':searchItem==item.condition}"
                v-for="searchItem in typeConList[item.type]"
                :key="searchItem"
              >{{ searchConList[searchItem].name }}
              </li>
            </ul>
          </vue-scroll>
        </el-popover>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script>
import "./iconfont/iconfont.css";
import {birthOptions} from './data'
import CityChoose from "@/components/functions/util/city/CityChoose2";

export default {
  name: "highSearch",
  props: ["searchList", "collegeList", "educationList","birthTypeChoose"],
  data() {
    return {
      birthOptions: birthOptions,
      searchConList: {
        //这是高级筛选条件的字典
        1: {key: 'icon-equal', name: '= 等于'},
        2: {key: 'icon-budengyu', name: '≠ 不等于'},
        3: {key: 'icon-weitijiao', name: 'Φ 为空'},
        4: {key: 'icon-buweikong', name: 'Ο 不为空'},
        5: {key: 'icon-baohan_xuanzhong', name: '⊂ 包含'},
        6: {key: 'icon-bubaohan_xuanzhong', name: '⊄ 不包含'},
        7: {key: 'icon-dayu2x', name: '> 大于'},
        8: {key: 'icon-dayudengyu', name: '≥ 大于等于'},
        9: {key: 'icon-xiaoyu2x', name: '< 小于'},
        10: {key: 'icon-xiaoyudengyu', name: '≤ 小于等于'},
        11:{key:'icon-cuowu',name:'☹ 格式不正确'}
      },
      typeConList: {
        //这是每个类型的列表对应筛选条件
        1: [1, 2, 3, 4, 5, 6], //单行文本类型
        2: [1, 2, 3, 4, 7, 8, 9, 10], //年份类型
        3: [1, 3, 4], //下拉选择类型
        'birth':[1, 2, 3, 4, 7, 8, 9, 10,11]
      },
      birthdayType: null,
      birthdayTypeList: [
        {key: 1, title: '年'},
        {key: 2, title: '月'},
        {key: 3, title: '日'},
        {key: 4, title: '年月'},
        {key: 5, title: '月日'},
        {key: 6, title: '年月日'},
      ]
    };
  },
  model: {
    prop: 'birthTypeChoose',
    event: 'change'
  },
  watch: {
    birthdayType(val) {
      this.searchList.forEach(item => {
        if (item.key === 'birthday') {
          item.value = ''
        }
      })
      this.$emit('change', val)
    }
  },
  components: {CityChoose},
  methods: {
    //选择高级筛选的条件
    selectSearchCon(proper, val) {
      // console.log(proper);
      // console.log(val);
      this.searchList.some((item, index) => {
        if (item.key == proper.key) {
          var obj = Object.assign({}, item);
          obj.condition = val;
          this.$set(this.searchList, index, obj);
          this.$refs[proper.key][0].doClose();
          return true;
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.serachInput {
  line-height: 30px;
  cursor: pointer;

  &:hover {
    color: rgb(63, 161, 182);
    transform: scale(1.05);
  }
}

.searchBox {
  position: relative;
}

.searchSelectBox {
  position: absolute;
  top: 1px;
  left: 10px;
  color: #606266;
}

.searchConItem {
  width: 100%;
  height: 25px;
  font-size: 14px;
  line-height: 25px;
  margin-left: 5px;
  cursor: pointer;

  &:hover {
    color: rgb(63, 161, 182);
    background-color: #ecf5ff;
  }
}

.ifSlect {
  color: rgb(63, 161, 182);
  background-color: #ecf5ff;
}

.flexwrap {
  flex-wrap: wrap;

  .w120 {
    width: 120px;
  }

  .w160 {
    width: 160px !important;
  }

  .w200 {
    width: 200px !important;
  }

  .el-input {
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .el-select {
    margin-right: 15px;
    width: 200px;
  }

  .el-range-editor {
    width: 250px;
  }
}

</style>
